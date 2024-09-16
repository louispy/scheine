# SCHEINE API

Built with Node, Typescript, Express, TypeORM, pdf-lib

# Setup

1. Requirement: Node version 20+; PostgreSQL
2. Copy `.env.example` into `.env` and add your PostgreSQL `DATABASE_URI` (and optionally `PORT`, defaults to 5000)
3. Install dependencies
```
npm install
```
4. Migrate Database Schema, seed patient & doctor
```
npm run migration:up
npm run seed
```
5. Run in development 
```
npm run dev
```
or build and run

```
npm start
```
The app should be running on port 5000 (default)

# Tables Design

Tables used are: patient, doctor, scheine_form, and scheine

## Patient and Doctor

patient and doctor are normal tables containing patient and doctor informations.
The minor change from the task description is the use of uuid for the primary id.


## Scheine Form

scheine_form is a table with tree-like structure that contains attributes of scheine form fields (is required, data type, format, etc).
The root of the tree is the scheine form type itself i.e Mustersammlung.
The root has no parent_id and the field name should be the Schein type.
The form fields of a Schein should have the parent_id of this root.
And if the field is nested (has children), the fields' id should be referenced as the parent_id (recursively to its children).

When validating a Schein, the children of a Schein are retrieved recursively to its deepest nested fields.

This design is chosen for its flexibility, especially if there are usecases of modifying existing Schein fields.
The downside is there are more database operations (insert and get) especially when there are a lot of nested fields.

An alternative is to leverage the use of JSON type field in PostgreSQL to store the form schema.
This approach is better for nested fields since it does not require multiple insert/ get operation.
The downsides are (1) to update a field, the whole schema needs to be retrieved first;
(2) no database level validation (for scheine_form), since JSON is a schemaless string/object, validation of the fields should be handled on the application level.

## Scheine

scheine contains the Scheine values, the common fields as described are patient_id, doctor_id and date_of_issue.
The custom fields are stored in `data` as a JSON object. This approach is chosen for its flexibility and ease of use.
Since the custom fields can be of any data type, storing in a rdbms/ sql rows would be troublesome.
The usecases are probably limited to retrieving the whole custom fields data anyways.

# APIs

Note: Examples are available in Postman collection in `postman` folder

## Create Scheine Form

In addition to the APIs task description, an API for scheine-form creation is added.
This api should be used first to define the form schema for scheine.

```
POST http://localhost:5000/scheine-form
```

Sample Response
```
{
    "message": "success"
}
```

Below are the sample request payloads for the three forms mentioned in the task description.

### Create Mustersammlung Form Payload

```
{
    "field": "Mustersammlung.de.en",
    "data_type": "object",
    "required": true,
    "children": [
        {
            "field": "date",
            "data_type": "string",
            "required": true,
            "regex": "^(\\d{4})-(0[1-9]|1[0-2])-([0-2][0-9]|3[01])$",
            "format_sample": "2001-01-01"
        },
        {
            "field": "diagnosis",
            "data_type": "string",
            "required": true
        },
        {
            "field": "hospital_regulation",
            "data_type": "object",
            "required": true,
            "children": [
                {
                    "field": "attending_physician_treatment",
                    "data_type": "boolean",
                    "required": true
                },
                {
                    "field": "emergency",
                    "data_type": "boolean",
                    "required": true
                },
                {
                    "field": "accident",
                    "data_type": "boolean",
                    "required": true
                },
                {
                    "field": "supply_suffering_bvg",
                    "data_type": "boolean",
                    "required": true
                },
                {
                    "field": "nearest_suitable_hospitals",
                    "data_type": "string",
                    "required": true
                }
            ]
        }
    ]
}
```

### Create Verordnung_einer_krankenbeforderung Form Payload

```
{
    "field": "Verordnung_einer_krankenbeforderung.de.en",
    "data_type": "object",
    "required": true,
    "children": [
        {
            "field": "date",
            "data_type": "string",
            "required": true,
            "regex": "^(\\d{4})-(0[1-9]|1[0-2])-([0-2][0-9]|3[01])$",
            "format_sample": "2001-01-01"
        },
        {
            "field": "transport_regulation",
            "data_type": "object",
            "required": true,
            "children": [
                {
                    "field": "work_accident",
                    "data_type": "boolean",
                    "required": true
                },
                {
                    "field": "accident",
                    "data_type": "boolean",
                    "required": true
                },
                {
                    "field": "disability_benefits",
                    "data_type": "boolean",
                    "required": true
                },
                {
                    "field": "outward_journey",
                    "data_type": "boolean",
                    "required": true
                },
                {
                    "field": "return_journey",
                    "data_type": "boolean",
                    "required": true
                }
            ]
        },
        {
            "field": "reason_for_promotion",
            "data_type": "object",
            "required": true,
            "children": [
                {
                    "field": "hospital_treatment",
                    "data_type": "boolean",
                    "required": true
                },
                {
                    "field": "outpatient_treatment",
                    "data_type": "boolean",
                    "required": true
                },
                {
                    "field": "other_reason",
                    "data_type": "string",
                    "required": false
                },
                {
                    "field": "high_frequency_treatment",
                    "data_type": "boolean",
                    "required": true
                },
                {
                    "field": "permanent_mobility_impairment",
                    "data_type": "boolean",
                    "required": true
                },
                {
                    "field": "out_reason_ambulance",
                    "data_type": "boolean",
                    "required": true
                },
                {
                    "field": "comparable_exceptional_case",
                    "data_type": "boolean",
                    "required": true
                }
            ]
        },
        {
            "field": "treatment",
            "data_type": "object",
            "required": true,
            "children": [
                {
                    "field": "from_date",
                    "data_type": "string",
                    "required": true,
                    "regex": "^([0-2][0-9]|3[01])(0[1-9]|1[0-2])(\\d{2})$"
                },
                {
                    "field": "to_date",
                    "data_type": "string",
                    "required": true,
                    "regex": "^([0-2][0-9]|3[01])(0[1-9]|1[0-2])(\\d{2})$"
                },
                {
                    "field": "frequency",
                    "data_type": "number",
                    "required": true
                },
                {
                    "field": "facility",
                    "data_type": "string",
                    "required": true
                }
            ]
        },
        {
            "field": "transportation",
            "data_type": "object",
            "required": true,
            "children": [
                {
                    "field": "taxi",
                    "data_type": "boolean",
                    "required": false
                },
                {
                    "field": "KTW",
                    "data_type": "boolean",
                    "required": false
                },
                {
                    "field": "KTW_reason",
                    "data_type": "string",
                    "required": false
                },
                {
                    "field": "ambulance",
                    "data_type": "boolean",
                    "required": false
                },
                {
                    "field": "naw",
                    "data_type": "boolean",
                    "required": false
                },
                {
                    "field": "other",
                    "data_type": "string",
                    "required": false
                },
                {
                    "field": "wheelchair",
                    "data_type": "boolean",
                    "required": false
                },
                {
                    "field": "carrying_chair",
                    "data_type": "boolean",
                    "required": false
                },
                {
                    "field": "lying",
                    "data_type": "boolean",
                    "required": false
                }
            ]
        },
        {
            "field": "other_reasons",
            "data_type": "string",
            "required": false
        }
    ]
}
```

### Create Zeugnis_über_den_mutmaßlichen_tag_der_entbindung form payload

```
{
    "field": "Zeugnis_über_den_mutmaßlichen_tag_der_entbindung.de.en",
    "data_type": "object",
    "required": true,
    "children": [
        {
            "field": "date",
            "data_type": "string",
            "required": true,
            "regex": "^(\\d{4})-(0[1-9]|1[0-2])-([0-2][0-9]|3[01])$",
            "format_sample": "2001-01-01"
        },
        {
            "field": "expected_delivey_date",
            "data_type": "string",
            "required": true,
            "regex": "^([0-2][0-9]|3[01])(0[1-9]|1[0-2])(\\d{2})$",
            "format_sample": "010120"
        },
        {
            "field": "examination_date",
            "data_type": "string",
            "required": true,
            "regex": "^([0-2][0-9]|3[01])(0[1-9]|1[0-2])(\\d{2})$",
            "format_sample": "010120"
        },
        {
            "field": "special_findings",
            "data_type": "string",
            "required": false
        }
    ]
}
```

## Create Schein

This API create Schein and validates its custom fields before insertion to databse.
The custom fields are put inside `data` key instead.
Since there are always common fields like patient_id, doctor_id and type, these values are validated earlier in the API/ controller layer.
The validation for custom fields are done afterwards in business logic process.

```
POST http://localhost:5000/scheine
```

### Mustersammlung Sample Request

Request
```
{
    "patient_id": "e9dc9232-34a8-4719-a408-483d8c53ba48",
    "doctor_id": "56a58120-697b-4181-831d-d0d78701ad2a",
    "type": "Mustersammlung.de.en",
    "data": {
        "date": "2024-01-01",
        "diagnosis": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "hospital_regulation": {
            "attending_physician_treatment": false,
            "emergency": true,
            "accident": false,
            "supply_suffering_bvg": true,
            "nearest_suitable_hospitals": "Hospital H"
        }
    }
}
```

Response
```
{
    "data": {
        "id": "41a8035e-265b-4c6c-bd13-d34a01c87435",
        "patient": {
            "id": "e9dc9232-34a8-4719-a408-483d8c53ba48",
            "name": "Erika",
            "date_of_birth": "2009-09-09",
            "insurance_number": "i1234",
            "establishment_number": "EN1234",
            "status": "fully paid",
            "financial_institution": "MyInsurance",
            "cost_unit_identification": "CUI1234"
        },
        "doctor": {
            "id": "56a58120-697b-4181-831d-d0d78701ad2a",
            "name": "Clint Eastwood",
            "doctor_number": "d1234",
            "medical_practice_number": "mp1234",
            "signature": "https://www.signwell.com/assets/vip-signatures/clint-eastwood-signature-e5a46a2363ef513d4fc0a45d8c0340943082ce60229084e3a12b82539321094b.png"
        },
        "created_at": "2024-09-16T02:37:10.293Z",
        "data": {
            "date": "2024-01-01",
            "diagnosis": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            "hospital_regulation": {
                "attending_physician_treatment": false,
                "emergency": true,
                "accident": false,
                "supply_suffering_bvg": true,
                "nearest_suitable_hospitals": "Hospital H"
            }
        },
        "pdf_base64": "..."
    }
}
```

Sample Invalid Schema Response
```
{
    "error": "One or more invalid fields are found",
    "errorList": [
        "hospital_regulation.attending_physician_treatment is required",
        "hospital_regulation.emergency is required",
        "hospital_regulation.accident is required",
        "hospital_regulation.supply_suffering_bvg is required",
        "hospital_regulation.nearest_suitable hospitals_is required"
    ]
}
```

### Verordnung_einer_krankenbeforderung.de.en Sample Request

Request
```
{
    "patient_id": "e9dc9232-34a8-4719-a408-483d8c53ba48",
    "doctor_id": "56a58120-697b-4181-831d-d0d78701ad2a",
    "type": "Verordnung_einer_krankenbeforderung.de.en",
    "data": {
        "date": "2024-01-01",
        "reason_for_promotion": {
            "hospital_treatment": true,
            "outpatient_treatment": true,
            "other_reason": "my other reason is... lorem ipsum",
            "high_frequency_treatment": true,
            "permanent_mobility_impairment": true,
            "out_reason_ambulance": true,
            "comparable_exceptional_case": true
        },
        "treatment": {
            "from_date": "010101",
            "to_date": "050101",
            "frequency": 2,
            "facility": "Hospital A, Aachen"
        },
        "transportation": {
            "taxi": true,
            "KTW": true,
            "KTW_reason": "because patient requires it",
            "ambulance": true,
            "naw": true,
            "other": "some sort of valid transportation",
            "wheelchair": true,
            "carrying_chair": true,
            "lying": true
        },
        "transport_regulation": {
            "work_accident": true,
            "accident": true,
            "disability_benefits": true,
            "outward_journey": true,
            "return_journey": true
        },
        "other_reasons": "No other reasons"
    }
}
```

Response
```
{
    "data": {
        "id": "e91c4c9c-25f6-471b-8836-bfe7119712ea",
        "patient": {
            "id": "e9dc9232-34a8-4719-a408-483d8c53ba48",
            "name": "Erika",
            "date_of_birth": "2009-09-09",
            "insurance_number": "i1234",
            "establishment_number": "EN1234",
            "status": "fully paid",
            "financial_institution": "MyInsurance",
            "cost_unit_identification": "CUI1234"
        },
        "doctor": {
            "id": "56a58120-697b-4181-831d-d0d78701ad2a",
            "name": "Clint Eastwood",
            "doctor_number": "d1234",
            "medical_practice_number": "mp1234",
            "signature": "https://www.signwell.com/assets/vip-signatures/clint-eastwood-signature-e5a46a2363ef513d4fc0a45d8c0340943082ce60229084e3a12b82539321094b.png"
        },
        "created_at": "2024-01-01",
        "data": {
            "date": "2024-01-01",
            "reason_for_promotion": {
                "hospital_treatment": true,
                "outpatient_treatment": true,
                "other_reason": "my other reason is... lorem ipsum",
                "high_frequency_treatment": true,
                "permanent_mobility_impairment": true,
                "out_reason_ambulance": true,
                "comparable_exceptional_case": true
            },
            "treatment": {
                "from_date": "010101",
                "to_date": "050101",
                "frequency": 2,
                "facility": "Hospital A, Aachen"
            },
            "transportation": {
                "taxi": true,
                "KTW": true,
                "KTW_reason": "because patient requires it",
                "ambulance": true,
                "naw": true,
                "other": "some sort of valid transportation",
                "wheelchair": true,
                "carrying_chair": true,
                "lying": true
            },
            "transport_regulation": {
                "work_accident": true,
                "accident": true,
                "disability_benefits": true,
                "outward_journey": true,
                "return_journey": true
            },
            "other_reasons": "No other reasons"
        },
        "pdf_base64": "..."
    }
}
```

### Zeugnis_über_den_mutmaßlichen_tag_der_entbindung.de.en Sample Request

Request
```
{
    "patient_id": "e9dc9232-34a8-4719-a408-483d8c53ba48",
    "doctor_id": "56a58120-697b-4181-831d-d0d78701ad2a",
    "type": "Zeugnis_über_den_mutmaßlichen_tag_der_entbindung.de.en",
    "data": {
        "date": "2024-01-01",
        "expected_delivery_date": "050101",
        "examination_date": "040101",
        "special_findings": "No special findings available. Further examination should be conducted."
    }
}
```

Response
```
{
    "data": {
        "id": "d08620fd-328a-425c-ac26-a38586c1b7db",
        "patient": {
            "id": "e9dc9232-34a8-4719-a408-483d8c53ba48",
            "name": "Erika",
            "date_of_birth": "2009-09-09",
            "insurance_number": "i1234",
            "establishment_number": "EN1234",
            "status": "fully paid",
            "financial_institution": "MyInsurance",
            "cost_unit_identification": "CUI1234"
        },
        "doctor": {
            "id": "56a58120-697b-4181-831d-d0d78701ad2a",
            "name": "Clint Eastwood",
            "doctor_number": "d1234",
            "medical_practice_number": "mp1234",
            "signature": "https://www.signwell.com/assets/vip-signatures/clint-eastwood-signature-e5a46a2363ef513d4fc0a45d8c0340943082ce60229084e3a12b82539321094b.png"
        },
        "created_at": "2024-01-01",
        "data": {
            "date": "2024-01-01",
            "expected_delivery_date": "050101",
            "examination_date": "040101",
            "special_findings": "No special findings available. Further examination should be conducted."
        },
        "pdf_base64": "..."
    }
}
```

## Preview Schein API

```
GET http://localhost:5000/scheine/<uuid>/preview
```

Sample Request
```
http://localhost:5000/scheine/3494d1ac-deba-4297-9d8b-35ab545101bf/preview
```

Sample Response
```
<base64 string>
```

## Get Schein API

```
http://localhost:5000/scheine?doctor_id=&patient_id=&start_date=&end_date=
```
All queries are optional. `start_date` and `end_date` filter Scheine based on date_of_issue (instead of created_at/ db time). Date format in YYYY-MM-DD (UTC) or ISO 8601 to avoid days and months format mismatch.

Sample Request
```
http://localhost:5000/scheine?doctor_id=56a58120-697b-4181-831d-d0d78701ad2a&patient_id=e9dc9232-34a8-4719-a408-483d8c53ba48&start_date=2023-01-01&end_date=2025-01-01
```

# PDF Templating

To generate PDF, `pdf-lib` is required as dependency.
pdf-lib is chosen over PDFKit for its pdf loading feature.
pdf-lib allows pdf template to be loaded and modified in contrast to PDFKit which only supports drawing PDF from scratch.

Adding template dynamically (in a data store) is quite a hassle. For now, to minimize hardcoding, a dependency injection pattern is used to add template.

To add a new template, A template function must be added to `template/templateFunc` and injected to the application in `app.ts` container in the `pdfTemplate` variable. The key in pdfTemplate should match the field name added to scheine_form.