const gaussianRandNormality = (normality) => {
    let rand = 0;
    for (let i = 0; i < normality; i += 1) {
        rand += Math.random();
    }

    return rand / 6;
}
const gaussianRand = () => {
    let rand = 0;
    let normality = 6;
    for (let i = 0; i < normality; i += 1) {
        rand += Math.random();
    }

    return rand / 6;
}

export { gaussianRand, gaussianRandNormality };