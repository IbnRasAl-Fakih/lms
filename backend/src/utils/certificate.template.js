const fs = require('fs');
const path = require('path');

module.exports = function generateCertificateTemplate({ fullName, courseTitle, issuedDate, certificateNumber }) {
  const imagePath = path.join(__dirname, '../assets/rus_certificate.jpg');
  const imageData = fs.readFileSync(imagePath).toString('base64');

  const arianaFont = fs.readFileSync(path.join(__dirname, '../assets/fonts/ArianaVioleta-dz2K.ttf')).toString('base64');

  return `
    <!DOCTYPE html>
    <html lang="ru">
      <head>
        <meta charset="UTF-8">
        <style>
          @font-face {
            font-family: 'ArianaVioleta';
            src: url(data:font/ttf;base64,${arianaFont}) format('truetype');
            font-weight: normal;
            font-style: normal;
          }
           
          html, body {
            margin: 0;
            padding: 0;
            width: 2480px;
            height: 3508px;
            overflow: hidden;
          }

          .certificate {
            width: 2480px;
            height: 3508px;
            position: relative;
          }

          .bg {
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 0;
          }

          .content {
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 1;
            text-align: center;
          }

          .number {
            position: absolute;
            top: 410px;
            right: 300px;
            font-size: 36px;
            font-family: Arial;
          }

          .name {
            position: absolute;
            top: 1730px;
            width: 100%;
            font-family: 'ArianaVioleta', cursive;
            color: #2c3e50;
            font-size: 250px;
          }

          .course {
            position: absolute;
            top: 2105px;
            width: 100%;
            font-family: 'PlayfairDisplay', serif;
            font-size: 70px;
            color: #333;
          }

          .date {
            position: absolute;
            bottom: 430px;
            left: 400px;
            font-size: 40px;
            font-family: Arial;
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <img class="bg" src="data:image/jpeg;base64,${imageData}" />
          <div class="content">
            <div class="number">№ ${certificateNumber}</div>
            <div class="name">${fullName}</div>
            <div class="course">${courseTitle}</div>
            <div class="date">${issuedDate}</div>
          </div>
        </div>
      </body>
    </html>
  `;
};