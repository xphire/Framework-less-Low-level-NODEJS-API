import Ajv from "ajv"

const ajv = new Ajv({coerceTypes : true})

export function baseValidator(schema,data){

    if(!schema || !data){
        return {
            valid : false,
            errors : 'kindly supply request body/query'
        }
    }

    const validate = ajv.compile(schema)

    const valid = validate(data)

    const errors = validate.errors ? validate.errors[0].message : null

    return {valid,errors}
}