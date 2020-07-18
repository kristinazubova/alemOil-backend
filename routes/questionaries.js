const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { EMAIL_PASS, EMAIL_USER } = require('./../config')

router.post('/', function (req, res, next) {
  const mailTransport = nodemailer.createTransport({
    service: 'Yandex',
    secure: false,
    port: 25,
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    tls: { rejectUnauthorized: false }
  });

  mailTransport.sendMail({
    from: EMAIL_USER,
    to: 'opt@alemoil.com',
    subject: 'Новая заявка на оптовую закупку',
    html: createMessage(req.body)
  }, function (err, info) {
    if (err) {
      res.status(500);
      res.send('Ошибка при отправке формы ' + err.message);
    } else if (info) {
      res.status(200);
      res.send('Форма отправлена');
    }

    res.end();
  });
});

function createMessage(params) {
  return `
  <style>
  
  table {
    border: 1px solid lightgray;
    border-collapse: collapse;
  }
  td, th {
    border: 1px solid lightgray;
    padding: 5px;
  }
  </style>
  <h3>Здравствуйте! Новая заявка на оптовую закупку от ${params.companyName}</h3>
  </br>
  <h4>Реквизиты компании</h4>
  </br>
  <table>
    <tr>
      <th>Наименование реквизита</th>
      <th>Данные компании</th>
    </tr>
    <tr>
      <td>Название компании</td>
      <td>${params.companyName}</td>
    </tr>
    <tr>
      <td>Юридический адрес</td>
      <td>${params.lawAdress}</td>
    </tr>
    <tr>
      <td>БИН</td>
      <td>${params.companyBIN}</td>
    </tr>
    <tr>
      <td>ИИК</td>
      <td>${params.companyIIK}</td>
    </tr>
    <tr>
      <td>БИК</td>
      <td>${params.companyBIK}</td>
    </tr>
    <tr>
      <td>КБе</td>
      <td>${params.companyKBE}</td>
    </tr>
    <tr>
      <td>Наименование банка</td>
      <td>${params.bankName}</td>
    </tr>
    <tr>
      <td>Способ вывоза</td>
      <td>${params.exportType}</td>
    </tr>
    <tr>
      <td>Цель покупки с вывозом с нефтебазы</td>
      <td>${params.targetExport}</td>
    </tr>
    <tr>
      <td>Email</td>
      <td>${params.email}</td>
    </tr>
    <tr>
      <td>Номер телефона</td>
      <td>${params.phoneNum}</td>
    </tr>
  </table>
  </br>
  <h4>Заказ</h4>
  <table>
    <tr>
      <th>Наименование продукта</th>
      <th>Объем в литрах</th>
    </tr>
    <tr>
      <td>Бензин АИ-92</td>
      <td>${params.order[0].productVolume}</td>
    </tr>
    <tr>
      <td>Бензин АИ-95</td>
      <td>${params.order[1].productVolume}</td>
    </tr>
    <tr>
      <td>Диз. топливо летнее</td>
      <td>${params.order[2].productVolume}</td>
    </tr>
    <tr>
      <td>Диз. топливо зимнее</td>
      <td>${params.order[3].productVolume}</td>
    </tr>
  </table>`
}
module.exports = router;