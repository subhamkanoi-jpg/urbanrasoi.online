# Rakhi order book — setup

Orders placed on `/rakhi` are posted into a Google Sheet the moment the guest
taps **Send order on WhatsApp**. The sheet is the working surface for the day:
production, billing and customers all read off the same two data tabs.

This takes about five minutes and you only do it once.

## 1. Make the sheet

1. Create a new Google Sheet. Name it something like **Urban Rasoi — Rakhi 2026 orders**.
2. **Extensions → Apps Script**. Delete whatever is in the editor.
3. Paste the whole of `Code.gs` from this folder.
4. Near the top, change `SHARED_SECRET` from `CHANGE-ME` to a password of your
   own. Anything long and random. Keep it handy for step 3.
5. Save, then pick `setUp` in the function dropdown and press **Run**.
   Google will ask you to authorise the script — approve it. This is your own
   script running on your own sheet.
6. Go back to the sheet. You should now see five tabs: **Orders**,
   **Line items**, **Production**, **Billing**, **Customers**.

## 2. Publish it

1. In the Apps Script editor: **Deploy → New deployment**.
2. Click the gear beside *Select type* and choose **Web app**.
3. Set **Execute as: Me**, and **Who has access: Anyone**.
   *Anyone* is required — the website calls it as an anonymous visitor. Your
   secret from step 1.4 is what actually protects it.
4. **Deploy**, then copy the **Web app URL**. It looks like
   `https://script.google.com/macros/s/AKfy…/exec`.

## 3. Tell the website about it

In Vercel → your project → **Settings → Environment Variables**, add both:

| Name | Value |
| --- | --- |
| `RAKHI_SHEET_WEBHOOK_URL` | the Web app URL from step 2.4 |
| `RAKHI_SHEET_SECRET` | the secret you set in step 1.4 |

Redeploy the site so they take effect.

## 4. Check it works

Place a real order on `/rakhi` — add a couple of dishes, fill your own name and
a pickup time, and send. Within a second or two a row should appear in
**Orders**, and the WhatsApp message should start with an order number like
`RB-001`. Delete that test row afterwards; order numbers just carry on.

## Living with it

**Orders** is the tab you edit. Two columns are yours:

- **Status** — every order arrives as `New`. Set it to `Confirmed` once the
  customer has actually sent the WhatsApp message, or `Cancelled` if it falls
  through. Anything marked `Cancelled` drops out of production, billing and
  customers automatically.
- **Advance received** — type what has been paid. **Balance** works itself out.

Everything else is written by the site or calculated.

**Production** is what the kitchen cooks from: pieces per dish, split across the
five prep waves (10:00, 12:00, 2:00, 4:00, 6:00). A guest picking an 11:30
collection is counted in the 10:00 wave. Share this tab read-only with staff.

**Billing** totals the day: item total, discount given, net billing, advances
taken and what is still outstanding on pickup day.

**Customers** groups orders by name and phone, so repeat buyers stand out.

## If something goes wrong

The sheet is deliberately not on the critical path. If it is unreachable, the
customer's order still goes to WhatsApp exactly as before — they simply will
not have an order number on their message, and you match it by name. Nothing is
lost, because the WhatsApp message has always been the real order.

To check the deployment is alive, open the Web app URL in a browser. It should
answer `{"ok":true,"service":"urban-rasoi-rakhi-orders"}`.

If you ever change `Code.gs`, you must **Deploy → Manage deployments → edit →
Version: New version** for the change to take effect. Saving alone is not enough.
