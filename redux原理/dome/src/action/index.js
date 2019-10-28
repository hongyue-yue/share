function importAll(r) {
    let modules = {}
    r.keys().forEach(key => (modules[key] = r(key)))
    return modules
}
const modules = importAll(require.context("./", true, /\.a\.js$/))
const actions=Object.assign.apply(null, Object.values(modules))
export default actions