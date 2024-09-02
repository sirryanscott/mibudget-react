export const convertObjectsToOptions = (dbObjects) => {
    let options = dbObjects.map(dbObject => {
        return {value: dbObject, label: dbObject.name}
    }
    )
    return options
}

export const convertStringObjectsToOptions = (dbObjects) => {
    let options = dbObjects.map(dbObject => {
        return {value: dbObject, label: dbObject}
    }
    )
    return options
}

export const convertStateObjectsToOptions = (dbObjects) => {
    let options = dbObjects.map(dbObject => {
        return {value: dbObject.state, label: dbObject.state}
    }
    )
    return options
}

export const convertTaxObjectsToOptions = (dbObjects) => {
    let options = dbObjects.map(dbObject => {
        return {value: dbObject, label: dbObject.zipcode}
    }
    )
    return options
}