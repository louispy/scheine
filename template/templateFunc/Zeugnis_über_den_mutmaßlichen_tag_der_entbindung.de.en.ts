import fs from 'fs/promises';
import * as _ from 'lodash';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const getSmallTextOpts = (x: number, y: number, font: any) => ({
  x,
  y,
  size: 7,
  font,
  color: rgb(0, 0, 0),
});

const getMediumTextOpts = (x: number, y: number, font: any) => ({
  x,
  y,
  size: 13,
  font,
  color: rgb(0, 0, 0),
});

export const generateZeugnis_über_den_mutmaßlichen_tag_der_entbindungDeEnPdf = async (data: any): Promise<string> => {
  const templateBytes = await fs.readFile('template/Zeugnis_über_den_mutmaßlichen_tag_der_entbindung.de.en.pdf');

  const pdfDoc = await PDFDocument.load(templateBytes);
  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // PAGE 1
  let page = pages[0];

  page.drawText(_.get(data, 'patient.financial_institution', ''), getSmallTextOpts(30, 260, font));
  page.drawText(_.get(data, 'patient.name', ''), getSmallTextOpts(30, 220, font));
  page.drawText(_.get(data, 'patient.date_of_birth', ''), getSmallTextOpts(210, 220, font));
  page.drawText(_.get(data, 'patient.cost_unit_identification', ''), getSmallTextOpts(30, 180, font));
  page.drawText(_.get(data, 'patient.insurance_number', ''), getSmallTextOpts(110, 180, font));
  page.drawText(_.get(data, 'patient.status', ''), getSmallTextOpts(205, 180, font));
  page.drawText(_.get(data, 'patient.establishment_number', ''), getSmallTextOpts(30, 160, font));
  page.drawText(_.get(data, 'doctor.doctor_number', ''), getSmallTextOpts(110, 160, font));
  page.drawText(_.get(data, 'data.date', ''), getSmallTextOpts(190, 160, font));

  page.drawText(_.get(data, 'data.expected_delivery_date', '').split('').join('  '), getMediumTextOpts(170, 120, font));
  page.drawText(_.get(data, 'data.examination_date', '').split('').join('  '), getMediumTextOpts(170, 95, font));

  const diagnosis = _.get(data, 'data.special_findings', '');

  const maxCharPerRow = 60;
  for (let i = 0; i < 3; i++) {
    const row = diagnosis.substring(i * maxCharPerRow, (i + 1) * maxCharPerRow);
    page.drawText(row, getSmallTextOpts(30, 70 - i * 20, font));
  }

  page.drawText(_.get(data, 'data.hospital_regulation.attending_physician_treatment') ? 'V' : 'X', getSmallTextOpts(270, 525, font));
  page.drawText(_.get(data, 'data.hospital_regulation.emergency') ? 'V' : 'X', getSmallTextOpts(340, 525, font));
  page.drawText(_.get(data, 'data.hospital_regulation.accident') ? 'V' : 'X', getSmallTextOpts(270, 500, font));
  page.drawText(_.get(data, 'data.hospital_regulation.supply_suffering_bvg') ? 'V' : 'X', getSmallTextOpts(340, 500, font));

  page.drawText(_.get(data, 'data.hospital_regulation.nearest_suitable_hospitals', ''), getSmallTextOpts(270, 475, font));
  page.drawRectangle({
    x: 270,
    y: 40,
    width: 100,
    height: 75,
    borderWidth: 0,
    color: rgb(1, 1, 1),
    opacity: 1,
    borderOpacity: 0,
  });
  let url = _.get(data, 'doctor.signature');
  try {
    const jpgImageBytes = await fetch(url).then((res) => res.arrayBuffer());

    const jpgImage = await pdfDoc.embedPng(jpgImageBytes);
    const jpgDims = jpgImage.scaleToFit(120, 80);
    page.drawImage(jpgImage, {
      x: 270,
      y: 40,
      width: jpgDims.width,
      height: jpgDims.height,
      opacity: 0.75,
    });
  } catch (error) {
    console.error(error);
  }

  // PAGE 2
  page = pages[1];
  const dob = _.get(data, 'patient.date_of_birth', '2001-01-01').split('-');
  const etd = _.get(data, 'patient.employment_termination_date', '2001-01-01').split('-');
  const dates = _.get(data, 'data.date', '2001-01-01').split('-');
  page.drawText(_.get(data, 'patient.name', ''), getSmallTextOpts(25, 250, font));
  page.drawText(`${dob[2]}${dob[1]}${dob[0].substring(0, 2)}`.split('').join('  '), getMediumTextOpts(315, 250, font));
  page.drawText(_.get(data, 'patient.postcode', '').split('').join('  '), getMediumTextOpts(25, 225, font));
  page.drawText(_.get(data, 'patient.place_of_residence', ''), getMediumTextOpts(100, 225, font));
  page.drawText(_.get(data, 'patient.house_number', ''), getMediumTextOpts(210, 225, font));
  page.drawText(_.get(data, 'patient.account_holder', ''), getSmallTextOpts(25, 200, font));
  page.drawText(_.get(data, 'patient.iban', '').split('').join('  '), getMediumTextOpts(22, 178, font));
  page.drawText(_.get(data, 'patient.financial_institution', ''), getSmallTextOpts(25, 155, font));
  page.drawText(_.get(data, 'patient.bic', '').split('').join('  '), getMediumTextOpts(245, 155, font));
  page.drawText(_.get(data, 'patient.employed_at', ''), getSmallTextOpts(100, 120, font));
  page.drawText(`${etd[2]}${etd[1]}${etd[0].substring(0, 2)}`.split('').join('  '), getMediumTextOpts(315, 120, font));
  page.drawText(_.get(data, 'patient.employer_address', ''), getSmallTextOpts(100, 95, font));
  page.drawText(_.get(data, 'patient.self_employed') ? 'V' : 'X', getSmallTextOpts(25, 80, font));
  page.drawText(_.get(data, 'patient.unemployed') ? 'V' : 'X', getSmallTextOpts(25, 60, font));
  page.drawText(_.get(data, 'patient.artist_publicist') ? 'V' : 'X', getSmallTextOpts(25, 35, font));

  page.drawText(`${dates[2]}${dates[1]}${dates[0].substring(0, 2)}`.split('').join('  '), getMediumTextOpts(173, 25, font));


  page.drawRectangle({
    x: 270,
    y: 20,
    width: 120,
    height: 25,
    borderWidth: 0,
    color: rgb(1, 1, 1),
    opacity: 1,
    borderOpacity: 0,
  });
  url = _.get(data, 'patient.signature');
  try {
    const jpgImageBytes = await fetch(url).then((res) => res.arrayBuffer());

    const jpgImage = await pdfDoc.embedPng(jpgImageBytes);
    const jpgDims = jpgImage.scaleToFit(80, 25);
    page.drawImage(jpgImage, {
      x: 270,
      y: 20,
      width: jpgDims.width,
      height: jpgDims.height,
      opacity: 0.75,
    });
  } catch (error) {
    console.error(error);
  }

  const bytes = await pdfDoc.save();
  const base64Pdf = Buffer.from(bytes).toString('base64');

  return base64Pdf;
};
