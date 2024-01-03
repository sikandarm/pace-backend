const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

exports.generateHtmlFromFormData = (
  requestedof,
  attn,
  project,
  reference,
  RFI_N,
  OF,
  date,
  cc,
  information,
  suggestions
) => {
  const baseCss = fs.readFileSync(
    path.join(__dirname, "JS", "base.min.css"),
    "utf-8"
  );
  const fancyCss = fs.readFileSync(
    path.join(__dirname, "JS", "fancy.min.css"),
    "utf-8"
  );
  const mainCss = fs.readFileSync(
    path.join(__dirname, "JS", "main.css"),
    "utf-8"
  );
  const compatibilityJs = fs.readFileSync(
    path.join(__dirname, "JS", "compatibility.min.js"),
    "utf-8"
  );
  const theViewerJs = fs.readFileSync(
    path.join(__dirname, "JS", "theViewer.min.js"),
    "utf-8"
  );
  return `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>RFI_Request</title>
        <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
            rel="stylesheet"
            integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
            crossorigin="anonymous" />
             <style>
    @page {
      size: A4;
      margin: 1cm;
    }
    body {
      margin: 0;
    }
    .container {
      width: 100% !important;
    }
  </style>
    </head>
    <body>
        <div class="container mt-3" style="width: 100%;">

            <div class="row">
                <div class="col-4">
                    <div class="row" style="border:1px solid black">
                        <div class="col-2">
                            <lable>Revision</lable>
                            <br />

                            <p style="">0</p>
                        </div>
                        <div class="col-2" style="margin-left: 100px;">
                            <lable>Date</lable>
                            <br />
                            <p style="">${date}</p>
                        </div>
                    </div>
                </div>
                <div class="col-4" style="border:1px solid black">
                      <h6>COMPANY
                    </h6>
                </div>
                <div class="col-4" style="border:1px solid black">
                    <h3 style="font-weight: bold;">Request for Information</h3>
                </div>
            </div>

            <div class="row mt-3">
               <div class="col-md-6">
      <table class="table table-bordered">
        <tbody>
          <tr>
            <th scope="row">REQUESTED OF:</th>
            <td>${requestedof}.</td>
          </tr>
          <tr>
            <th scope="row">ATTN:</th>
            <td>${attn}</td>
          </tr>
          <tr>
            <th scope="row">PROJECT:</th>
            <td>${project}</td>
          </tr>
          <tr>
            <th scope="row">REFERENCE:</th>
            <td>${reference}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="col-md-6">
      <table class="table table-bordered">
        <tbody>
          <tr>
            <th scope="row">RFI Nº:</th>
            <td>${RFI_N}</td>
          </tr>
          <tr>
            <th scope="row">O.F.:</th>
            <td>${OF}</td>
          </tr>
          <tr>
            <th scope="row">DATE:</th>
            <td>${date}</td>
          </tr>
          <tr>
            <th scope="row">CC:</th>
            <td>${cc}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
            </div>
<div class="container" style="width: 100%;">
            <div class="row mt-3">
                <div class="col-md-12">
                    <h5
                        style="background-color:grey">INFORMATION
                        REQUESTED:</h5>
                    <p>${information}</p>

                </div>
            </div>
</div>
<div class="container" style="width: 100%;">
            <div class="row mt-3">
                <div class="col-md-12">
                    <h5
                        style="background-color: rgba(187, 174, 174, 0.685)">SUGGESTIONS:</h5>
                    <!-- Add suggestions content here -->
                                        <p>${suggestions}</p>

                </div>
            </div>
</div>
<div class="container" style="width: 100%;">

            <div class="row mt-3">
                <div class="col-md-12">
                    <h5>REQUESTED BY:______</h5>

                </div>
            </div>
</div>
<div class="container" style="width: 100%;">

            <div class="row mt-3">
                <div class="row" style="margin-bottom: 100px;">
                    <h5
                        style="background-color: rgba(187, 174, 174, 0.685)">ANSWER:</h5>
                    <p style="text-align: center;">Thank you for your prompt
                        response to this request for
                        information!</p>

                </div>
</div>
                <div class="row">

                    <h5>
                        ANSWERED BY:___________
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        SIGNATURE:____________
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        DATE:____________
                    </h5>
                    <!-- Add answered by content here -->
                </div>
            </div>
<div class="container" style="width: 100%;">

            <div class="row mt-3">
                <div class="col-md-12">
                    <h5
                        style="background-color: rgba(187, 174, 174, 0.685); margin-bottom: 100px;">
                        FINAL ACTION (include documents changed or affected by
                        the closure
                        of the RFI):
                    </h5>
                    <!-- Add final action content here -->
                </div>
            </div>

            <div class="row mt-3">
                <div class="row">
                    <h5>

                        FINAL ACTION BY:___________
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        SIGNATURE:____________
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        DATE:____________
                    </h5>
                    <!-- Add final action by content here -->
                </div>

                <div class="col-md-6">
                    <!-- Add signature and date content here -->
                </div>
            </div>
            </div>
        </div>

        <script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"
            crossorigin="anonymous"></script>
    </body>
</html>

`;
};

// Helper function to generate PDF from HTML content using Puppeteer
exports.generatePdfFromHtml = async (htmlContent) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent);
  const pdfBuffer = await page.pdf({ format: "A4" });
  await browser.close();
  return pdfBuffer;
};
