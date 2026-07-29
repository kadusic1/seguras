package util

import (
	"fmt"
	"html"
)

// EmailRow renders a single label/value row in the notification table.
// Values are HTML-escaped since they come directly from user input.
func EmailRow(label, value string) string {
	return fmt.Sprintf(`
        <tr>
          <td style="padding:12px 20px;border-bottom:1px solid #27272a;
                    color:#a1a1aa;font-size:13px;font-weight:600;
                    letter-spacing:.03em;text-transform:uppercase;
                    white-space:nowrap;vertical-align:top;">%s</td>
          <td style="padding:12px 20px;border-bottom:1px solid #27272a;
                    color:#ffffff;font-size:15px;font-weight:500;
                    vertical-align:top;">%s</td>
        </tr>`, html.EscapeString(label), html.EscapeString(value))
}

// EmailShell wraps rows and optional extra content in the Seguras branded
// email template. The extra parameter goes between the details table and
// the footer; pass "" when not needed.
func EmailShell(title, badge, intro, footer, rows, extra string) string {
	return fmt.Sprintf(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>%s</title>
  </head>
  <body style="margin:0;padding:0;
        background-color:#09090b;
        font-family:Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%%" cellpadding="0" cellspacing="0"
      style="background-color:#09090b;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0"
            cellspacing="0"
            style="max-width:600px;width:100%%;background-color:#000000;
                  border:1px solid #27272a;border-radius:12px;
                  overflow:hidden;">
            <tr>
              <td style="background-color:#000000;padding:28px 24px 20px 24px;
                        border-bottom:2px solid #dc2626;">
                <table role="presentation" width="100%%" cellpadding="0"
                  cellspacing="0">
                  <tr>
                    <td>
                      <span style="font-size:24px;font-weight:900;
                            font-style:italic;letter-spacing:.02em;
                            color:#ffffff;">SEGURAS</span><br/>
                      <span style="font-size:12px;font-weight:700;
                            letter-spacing:.08em;
                            color:#a1a1aa;">SECURITY</span>
                    </td>
                    <td align="right" style="vertical-align:middle;">
                      <span style="display:inline-block;
                            background-color:#dc2626;color:#ffffff;
                            font-size:11px;font-weight:700;
                            letter-spacing:.05em;text-transform:uppercase;
                            padding:6px 12px;border-radius:999px;">%s</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 24px 4px 24px;">
                <p style="margin:0;color:#ffffff;font-size:18px;
                      font-weight:700;">%s</p>
                <p style="margin:6px 0 0 0;color:#a1a1aa;font-size:13px;">
                  %s</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px 8px 24px;">
                <table role="presentation" width="100%%" cellpadding="0"
                  cellspacing="0"
                  style="background-color:#0a0a0a;border:1px solid #27272a;
                        border-radius:8px;overflow:hidden;">
                  %s
                </table>
              </td>
            </tr>
            %s
            <tr>
              <td style="padding:24px;">
                <div style="height:1px;background-color:#27272a;
                      margin-bottom:16px;"></div>
                <p style="margin:0;color:#71717a;font-size:12px;">%s</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`, title, badge, title, intro, rows, extra, footer)
}