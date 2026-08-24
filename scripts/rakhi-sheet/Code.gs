/**
 * Urban Rasoi — Raksha Bandhan order book.
 *
 * Paste this into a Google Sheet (Extensions > Apps Script), run setUp once,
 * then deploy as a Web app so the website can post orders into it.
 * Step-by-step instructions: scripts/rakhi-sheet/README.md in the site repo.
 *
 * Tabs it maintains:
 *   Orders      one row per order, with the columns you edit by hand
 *   Line items  one row per dish per order — what the production view counts
 *   Production  dish x prep window, live
 *   Billing     totals, advances taken, outstanding
 *   Customers   who ordered, how often, how much
 */

var SHARED_SECRET = 'CHANGE-ME'; // must match RAKHI_SHEET_SECRET in Vercel
var ORDER_PREFIX = 'RB-';

var ORDER_HEADERS = [
  'Order ID', 'Received', 'Status', 'Customer', 'Phone', 'Pickup slot',
  'Prep window', 'Dishes', 'Pieces', 'Item total', 'Discount', 'To pay',
  'Advance received', 'Balance', 'Note', 'Source'
];

var LINE_HEADERS = [
  'Order ID', 'Received', 'Status', 'Customer', 'Pickup slot', 'Prep window',
  'Section', 'Dish', 'Qty', 'Unit price', 'Line total'
];

/** Run this once from the Apps Script editor to build the tabs. */
function setUp() {
  ensureSheets_();
  SpreadsheetApp.getActive().toast('Order book ready.');
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
  } catch (err) {
    return json_({ ok: false, error: 'busy' });
  }

  try {
    var body = JSON.parse(e.postData.contents);

    if (SHARED_SECRET && SHARED_SECRET !== 'CHANGE-ME' && body.secret !== SHARED_SECRET) {
      return json_({ ok: false, error: 'unauthorised' });
    }
    if (!body.customer || !body.lines || !body.lines.length) {
      return json_({ ok: false, error: 'bad-payload' });
    }

    var sheets = ensureSheets_();
    var orderId = nextOrderId_(sheets.orders);
    var received = body.placedAt ? new Date(body.placedAt) : new Date();
    var dishes = body.lines
      .map(function (l) { return l.qty + ' x ' + l.name; })
      .join(', ');

    var orderRow = sheets.orders.getLastRow() + 1;
    sheets.orders.appendRow([
      orderId,
      received,
      'New',
      body.customer,
      body.phone || '',
      body.pickupSlot || '',
      body.prepWindow || '',
      dishes,
      body.pieces || 0,
      body.itemTotal || 0,
      body.discount || 0,
      body.toPay || 0,
      0,
      '=IF(L' + orderRow + '="","",L' + orderRow + '-M' + orderRow + ')',
      body.note || '',
      body.source || 'website'
    ]);

    var firstLineRow = sheets.lines.getLastRow() + 1;
    var lineRows = body.lines.map(function (line, i) {
      var r = firstLineRow + i;
      return [
        orderId,
        received,
        // Mirrors the order's status, so cancelling an order in Orders drops
        // its dishes out of the production counts with no further edits.
        '=IFERROR(VLOOKUP(A' + r + ',Orders!A:C,3,FALSE),"")',
        body.customer,
        body.pickupSlot || '',
        body.prepWindow || '',
        line.section || '',
        line.name,
        line.qty,
        line.unitPrice,
        line.lineTotal
      ];
    });
    if (lineRows.length) {
      sheets.lines
        .getRange(firstLineRow, 1, lineRows.length, LINE_HEADERS.length)
        .setValues(lineRows);
    }

    return json_({ ok: true, orderId: orderId });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** Open the deployment URL in a browser to check it is alive. */
function doGet() {
  return json_({ ok: true, service: 'urban-rasoi-rakhi-orders' });
}

function nextOrderId_(orders) {
  var used = Math.max(0, orders.getLastRow() - 1);
  return ORDER_PREFIX + ('000' + (used + 1)).slice(-3);
}

function ensureSheets_() {
  var ss = SpreadsheetApp.getActive();
  var orders = tab_(ss, 'Orders', ORDER_HEADERS);
  var lines = tab_(ss, 'Line items', LINE_HEADERS);
  buildProduction_(ss);
  buildBilling_(ss);
  buildCustomers_(ss);

  var first = ss.getSheets()[0];
  if (first.getName() === 'Sheet1' && first.getLastRow() === 0 && ss.getSheets().length > 1) {
    ss.deleteSheet(first);
  }
  return { orders: orders, lines: lines };
}

function tab_(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#f4ead8');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function buildProduction_(ss) {
  if (ss.getSheetByName('Production')) return;
  var sheet = ss.insertSheet('Production');
  sheet.getRange('A1').setValue('Production list').setFontWeight('bold').setFontSize(14);
  sheet.getRange('A2').setValue('Live. Cancel an order in Orders and its dishes drop out of these counts.');

  sheet.getRange('A4').setValue('Pieces needed, by prep window').setFontWeight('bold');
  sheet.getRange('A5').setFormula(
    "=IFERROR(QUERY('Line items'!A2:K,\"select H, sum(I) where H is not null and lower(C) <> 'cancelled' group by H pivot F\",0),\"No orders yet\")"
  );

  sheet.getRange('J4').setValue('Total per dish').setFontWeight('bold');
  sheet.getRange('J5').setFormula(
    "=IFERROR(QUERY('Line items'!A2:K,\"select H, sum(I) where H is not null and lower(C) <> 'cancelled' group by H label sum(I) 'Pieces'\",0),\"No orders yet\")"
  );

  sheet.setColumnWidth(1, 320);
  sheet.setColumnWidth(10, 320);
}

function buildBilling_(ss) {
  if (ss.getSheetByName('Billing')) return;
  var sheet = ss.insertSheet('Billing');
  sheet.getRange('A1').setValue('Billing').setFontWeight('bold').setFontSize(14);
  sheet.getRange('A2').setValue('Cancelled orders are excluded throughout.');

  var rows = [
    ['Orders received', '=COUNTA(Orders!A2:A)'],
    ['Cancelled', '=COUNTIF(Orders!C2:C,"Cancelled")'],
    ['Live orders', '=B4-B5'],
    ['', ''],
    ['Item total', '=SUMIF(Orders!C2:C,"<>Cancelled",Orders!J2:J)'],
    ['Website discount', '=SUMIF(Orders!C2:C,"<>Cancelled",Orders!K2:K)'],
    ['Net billing', '=SUMIF(Orders!C2:C,"<>Cancelled",Orders!L2:L)'],
    ['', ''],
    ['Advance received', '=SUMIF(Orders!C2:C,"<>Cancelled",Orders!M2:M)'],
    ['Outstanding on pickup day', '=B10-B12'],
    ['', ''],
    ['Average order', '=IFERROR(B10/B6,0)']
  ];
  sheet.getRange(4, 1, rows.length, 2).setValues(rows);
  sheet.getRange(4, 1, rows.length, 1).setFontWeight('bold');
  sheet.getRange('B8:B15').setNumberFormat('₹#,##0');
  sheet.setColumnWidth(1, 240);
}

function buildCustomers_(ss) {
  if (ss.getSheetByName('Customers')) return;
  var sheet = ss.insertSheet('Customers');
  sheet.getRange('A1').setValue('Customers').setFontWeight('bold').setFontSize(14);
  sheet.getRange('A2').setValue('Built from live orders. Fill a missing phone in Orders and it appears here.');
  sheet.getRange('A4').setFormula(
    "=IFERROR(QUERY(Orders!A2:P,\"select D, E, count(A), sum(L), sum(M) where D is not null and lower(C) <> 'cancelled' group by D, E label count(A) 'Orders', sum(L) 'Billed', sum(M) 'Paid'\",0),\"No orders yet\")"
  );
  sheet.setColumnWidth(1, 240);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
