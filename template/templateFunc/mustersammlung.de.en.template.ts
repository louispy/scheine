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

export const generateMustersammlungDeEnPdf = async (
  data: any,
): Promise<string> => {
  const templateBytes = await fs.readFile('template/Mustersammlung.de.en.pdf');

  const pdfDoc = await PDFDocument.load(templateBytes);
  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const page = pages[0];

  page.drawText(
    _.get(data, 'data.insurance_name', ''),
    getSmallTextOpts(30, 560, font),
  );
  page.drawText(_.get(data, 'patient.name'), getSmallTextOpts(30, 520, font));
  page.drawText(
    _.get(data, 'patient.date_of_birth', ''),
    getSmallTextOpts(210, 520, font),
  );
  page.drawText(
    _.get(data, 'data.cost_unit_identification', ''),
    getSmallTextOpts(30, 480, font),
  );
  page.drawText(
    _.get(data, 'patient.insurance_number', ''),
    getSmallTextOpts(110, 480, font),
  );
  page.drawText(_.get(data, 'data.status'), getSmallTextOpts(205, 480, font));
  page.drawText(
    _.get(data, 'data.establishment_no', ''),
    getSmallTextOpts(30, 450, font),
  );
  page.drawText(
    _.get(data, 'doctor.doctor_number', ''),
    getSmallTextOpts(110, 450, font),
  );
  page.drawText(_.get(data, 'data.date', ''), getSmallTextOpts(190, 450, font));

  const diagnosis =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum';
  const maxCharPerRow = 65;
  for (let i = 0; i < 5; i++) {
    const row = diagnosis.substring(i * maxCharPerRow, (i + 1) * maxCharPerRow);
    page.drawText(row, getSmallTextOpts(30, 420 - i * 24, font));
  }

  page.drawText(
    _.get(data, 'data.hospital_regulation.attending_physician_treatment')
      ? 'V'
      : 'X',
    getSmallTextOpts(270, 525, font),
  );
  page.drawText(
    _.get(data, 'data.hospital_regulation.emergency') ? 'V' : 'X',
    getSmallTextOpts(340, 525, font),
  );
  page.drawText(
    _.get(data, 'data.hospital_regulation.attending_physician_treatment')
      ? 'V'
      : 'X',
    getSmallTextOpts(270, 500, font),
  );
  page.drawText(
    _.get(data, 'data.hospital_regulation.supply_suffering_bvg') ? 'V' : 'X',
    getSmallTextOpts(340, 500, font),
  );

  page.drawText(
    _.get(data, 'data.hospital_regulation.nearest_suitable_hospitals', ''),
    getSmallTextOpts(270, 475, font),
  );
  page.drawRectangle({
    x: 270,
    y: 330,
    width: 130,
    height: 100,
    borderWidth: 0,
    color: rgb(1, 1, 1),
    opacity: 1,
    borderOpacity: 0,
  });
  const url = _.get(data, 'doctor.signature');
  try {
    const jpgImageBytes = await fetch(url).then((res) => res.arrayBuffer());

    const jpgImage = await pdfDoc.embedPng(jpgImageBytes);
    const jpgDims = jpgImage.scaleToFit(130, 130);
    page.drawImage(jpgImage, {
      x: 270,
      y: 350,
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
