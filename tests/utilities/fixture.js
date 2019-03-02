module.exports = async function(name, slottedHTML) {
    document.body.innerHTML = `<${name}>${slottedHTML}</${name}>`;
    const element = document.querySelector(name);

    element.updateComplete && await element.updateComplete;

    return element;
}