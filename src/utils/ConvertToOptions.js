export const convertObjectsToOptions = (dbObjects) => {
    let options = dbObjects.map(dbObject => {
        return {value: dbObject, label: dbObject.name}
    }
    )
    return options
}