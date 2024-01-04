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
        .container {
            width: 95%;
            margin: auto;
        }

        .row {
            display: flex;
            flex-wrap: wrap;
            margin-bottom: 10px;
        }

        .col-4 {
            width: 33.33%;
            box-sizing: border-box;
            padding: 0 10px;
        }

        .col-md-6 {
            width: 50%;
            box-sizing: border-box;
            padding: 0 10px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        th, td {
            border: 1px solid black;
            padding: 8px;
        }

        h5 {
            background-color: rgba(187, 174, 174, 0.685);
            margin-bottom: 20px;
            padding: 10px;
        }

       .revision-container {
            /* border: 1px solid black; */
            padding: 10px;
            display: flex;
            justify-content: space-between;
            /* border-bottom: 1px solid black; Add this line for the bottom border */
        }

        .revision-container label {
            margin-bottom: 5px;
        }

          .vertical-line {
            border-top: 1px solid black; /* Top border of the line */
            border-left: 1px solid black; /* Bottom border of the line */
            height: 100px; /* Adjust the height of the line */
            margin: -9px; /* Center the line vertically */
        }
    </style>
    </head>
    <body>
        <div class="container mt-3">

            <div class="row" style="border: 2px solid black;">
                <div class="col-4">
                    <div class="revision-container">
                        <div>
                            <label>Revision</label>
                            <p style="margin-top: 11px;">0</p>
                        </div>
                        <div class="vertical-line"></div>
                        <div>
                            <label>Date</label>
                            <p style="margin-top: 11px;">${date}</p>
                        </div>
                    </div>
                </div>
                <div class="col-4" style="border: 1px solid black;">
                    <h6>Reynolds Welding & Fabrication LLC,<br />
                        148 Addison Road,<br />
                        Windsor, CT 06095
                    </h6>
                </div>
                <div class="col-4">
                    <h3 style="font-weight: bold;">Request for Information</h3>
                </div>
            </div>

            <div class="row">
                <div class="col-md-6">
                    <table>
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
                    <table>
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

            <div class="row mt-3">
                <div class="col-md-12">
                    <h5
                        style="background-color: rgba(187, 174, 174, 0.685)">INFORMATION
                        REQUESTED:</h5>
                    <p>${information}</p>
                </div>
            </div>

            <div class="row mt-3">
                <div class="col-md-12">
                    <h5
                        style="background-color: rgba(187, 174, 174, 0.685)">SUGGESTIONS:</h5>
                    <p>${suggestions}</p>
                </div>
            </div>

            <div class="row mt-3">
                <div class="col-md-12">
                    <h5>REQUESTED BY:______</h5>
                </div>
            </div>

            <div class="row mt-3">
                <div class="row" style="margin-bottom: 100px;">
                    <h5
                        style="background-color: rgba(187, 174, 174, 0.685)">ANSWER:</h5>
                    <p style="text-align: center;">Thank you for your prompt
                        response to this request for information!</p>
                </div>
            </div>

            <div class="row">
                <h5>
                    ANSWERED BY:___________
                    
                    SIGNATURE:____________
                    
                    DATE:____________
                </h5>
            </div>

            <div class="row mt-3">
                <div class="col-md-12">
                    <h5
                        style="background-color: rgba(187, 174, 174, 0.685); margin-bottom: 100px;">
                        FINAL ACTION (include documents changed or affected by
                        the closure of the RFI):
                    </h5>
                </div>
            </div>

            <div class="row mt-3">
                <div class="row">
                    <h5>
                        FINAL ACTION BY:___________
                        
                        SIGNATURE:____________
                        
                        DATE:____________
                    </h5>
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
