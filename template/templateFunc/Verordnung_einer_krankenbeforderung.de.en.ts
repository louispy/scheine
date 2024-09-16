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
  size: 12,
  font,
  color: rgb(0, 0, 0),
});

export const generateVerordnung_einer_krankenbeforderungdeenPdf = async (data: any): Promise<string> => {
  const templateBytes = await fs.readFile('template/Verordnung_einer_krankenbeforderung.de.en.pdf');

  const pdfDoc = await PDFDocument.load(templateBytes);
  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const page = pages[0];

  page.drawText(_.get(data, 'data.insurance_name', ''), getSmallTextOpts(30, 560, font));
  page.drawText(_.get(data, 'patient.name', ''), getSmallTextOpts(30, 520, font));
  page.drawText(_.get(data, 'patient.date_of_birth', ''), getSmallTextOpts(210, 520, font));
  page.drawText(_.get(data, 'data.cost_unit_identification', ''), getSmallTextOpts(30, 480, font));
  page.drawText(_.get(data, 'patient.insurance_number', ''), getSmallTextOpts(110, 480, font));
  page.drawText(_.get(data, 'data.status', ''), getSmallTextOpts(205, 480, font));
  page.drawText(_.get(data, 'data.establishment_no', ''), getSmallTextOpts(30, 450, font));
  page.drawText(_.get(data, 'doctor.doctor_number', ''), getSmallTextOpts(110, 450, font));
  page.drawText(_.get(data, 'data.date', ''), getSmallTextOpts(190, 450, font));

  page.drawText(_.get(data, 'data.transport_regulation.accident') ? 'V' : 'X', getSmallTextOpts(270, 535, font));

  page.drawText(_.get(data, 'data.transport_regulation.work_accident') ? 'V' : 'X', getSmallTextOpts(270, 513, font));

  page.drawText(_.get(data, 'data.transport_regulation.disability_benefits') ? 'V' : 'X', getSmallTextOpts(270, 490, font));

  page.drawText(_.get(data, 'data.transport_regulation.outward_journey') ? 'V' : 'X', getSmallTextOpts(270, 465, font));
  page.drawText(_.get(data, 'data.transport_regulation.return_journey') ? 'V' : 'X', getSmallTextOpts(340, 465, font));
 
  // section 1
  page.drawText(_.get(data, 'data.reason_for_promotion.hospital_treatment') ? 'V' : 'X', getSmallTextOpts(45, 405, font));
  page.drawText(_.get(data, 'data.reason_for_promotion.post_hospital_treatment') ? 'V' : 'X', getSmallTextOpts(270, 405, font));
  page.drawText(_.get(data, 'data.reason_for_promotion.outpatient_treatment') ? 'V' : 'X', getSmallTextOpts(45, 380, font));
  page.drawText(_.get(data, 'data.reason_for_promotion.other_reason') ? 'V' : 'X', getSmallTextOpts(45, 355, font));
  page.drawText(_.get(data, 'data.reason_for_promotion.other_reason', ''), getSmallTextOpts(150, 355, font));
  page.drawText(_.get(data, 'data.reason_for_promotion.high_frequency_treatment') ? 'V' : 'X', getSmallTextOpts(45, 320, font));
  page.drawText(_.get(data, 'data.reason_for_promotion.comparable_exceptional_case') ? 'V' : 'X', getSmallTextOpts(270, 320, font));
  page.drawText(_.get(data, 'data.reason_for_promotion.permanent_mobility_impairment') ? 'V' : 'X', getSmallTextOpts(45, 295, font));
  page.drawText(_.get(data, 'data.reason_for_promotion.out_reason_ambulance') ? 'V' : 'X', getSmallTextOpts(45, 270, font));


  // section 2
  page.drawText(_.get(data, 'data.treatment.from_date').split('').join('  '), getMediumTextOpts(70, 225, font));
  page.drawText(_.get(data, 'data.treatment.frequency', 0).toString(), getSmallTextOpts(175, 225, font));
  page.drawText(_.get(data, 'data.treatment.to_date', '').split('').join('  '), getMediumTextOpts(320, 225, font));
  page.drawText(_.get(data, 'data.treatment.facility', ''), getSmallTextOpts(30, 200, font));


  // section 3
  page.drawText(_.get(data, 'data.transportation.taxi') ? 'V' : 'X', getSmallTextOpts(30, 160, font));
  page.drawText(_.get(data, 'data.transportation.KTW') ? 'V' : 'X', getSmallTextOpts(30, 135, font));
  page.drawText(_.get(data, 'data.transportation.KTW_reason', ''), getSmallTextOpts(30, 115, font));
  page.drawText(_.get(data, 'data.transportation.ambulance') ? 'V' : 'X', getSmallTextOpts(30, 80, font));
  page.drawText(_.get(data, 'data.transportation.naw') ? 'V' : 'X', getSmallTextOpts(75, 80, font));
  page.drawText(_.get(data, 'data.transportation.other') ? 'V' : 'X', getSmallTextOpts(120, 80, font));
  page.drawText(_.get(data, 'data.transportation.other', ''), getSmallTextOpts(160, 80, font));
  page.drawText(_.get(data, 'data.transportation.wheelchair') ? 'V' : 'X', getSmallTextOpts(205, 160, font));
  page.drawText(_.get(data, 'data.transportation.carrying_chair') ? 'V' : 'X', getSmallTextOpts(205, 135, font));
  page.drawText(_.get(data, 'data.transportation.lying') ? 'V' : 'X', getSmallTextOpts(205, 115, font));

  // section 4
  page.drawText(_.get(data, 'data.other_reasons', ''), getSmallTextOpts(30, 35, font));

  page.drawRectangle({
    x: 270,
    y: 40,
    width: 110,
    height: 80,
    borderWidth: 0,
    color: rgb(1, 1, 1),
    opacity: 1,
    borderOpacity: 0,
  });
  const url = _.get(data, 'doctor.signature');
  try {
    const jpgImageBytes = await fetch(url).then((res) => res.arrayBuffer());

    const jpgImage = await pdfDoc.embedPng(jpgImageBytes);
    const jpgDims = jpgImage.scaleToFit(120, 120);
    page.drawImage(jpgImage, {
      x: 270,
      y: 50,
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
