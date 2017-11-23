interface ValidatorResult {
    data: any
}

interface ValidatorSingleResult {
    field: string;
    value: any;
}

interface ValidatorInterface {
    validateAll() : Promise<ValidatorResult>
    validate(fieldName : string , scope : string) : Promise<ValidatorSingleResult>;
    setErrors(errorsObj : string, scope : string) : void
}

export {
    ValidatorResult,
    ValidatorSingleResult,
    ValidatorInterface
}