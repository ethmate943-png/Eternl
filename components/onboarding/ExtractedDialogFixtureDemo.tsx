"use client";


const html = "<div role=\"dialog\" aria-modal=\"true\" class=\"demo-modal\">\n      <div class=\"header\">\n        <span class=\"cap-first\">Select wallet type</span>\n      </div>\n      <div class=\"content\">\n        <button type=\"button\" class=\"demo-btn\">New Wallet</button>\n      </div>\n    </div>";

export function ExtractedDialogFixtureDemo() {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
