/** @type {function(number[], number[], function): number} */
export function log_likelihood(data, theta, pdf) {
    let bigPi = data[0];
    for(let i = 0; i < data.length; i++) {
        bigPi *= pdf(data[i], theta);
        console.log(bigPi)
    }
    return bigPi;
}

/** @type {function(number, number[]): number} */
export function normal_pdf(xi, theta = [0, 1]) {
    let mean = theta[0];
    let variance = theta[1];
    let result = (1 / (Math.sqrt(2 * Math.PI * variance))) * Math.exp((-1 * (xi - mean) * (xi - mean)) / (2 * variance));
    return result;
}

/** @type {function(number[], number, number): number} */
export function normal_log_likelihood(data, mu_hat, variance_hat) {
    let sum = 0;
    for(let i = 0; i < data.length; i++) {
        sum += ((data[i] - mu_hat) * (data[i] - mu_hat)) / (2 * variance_hat)
    }
    sum *= -1;
    sum -= ((data.length / 2) * Math.log(2 * Math.PI * variance_hat));
    return sum;
}

const precision = 4;
/** @type {function(number): number} */
export function round(x) {
    return Math.round(x * (Math.pow(10, precision))) / (Math.pow(10, precision));
}
/** @type {function(number[]): number[]} */
export function roundArr(X) {
    return X.map((x) => { return Math.round(x * (Math.pow(10, precision))) / (Math.pow(10, precision))});
}

/** @type {function(number[], number, number): number[][]} */
export function graph_normal_log_likelihood(data, mu_hat, variance_hat) {
    
    const fineness = 10;

    let step = variance_hat / fineness;

    let mu_hat_min = mu_hat - (variance_hat * 3);
    let mu_hat_max = mu_hat + (variance_hat * 3);

    let graph = [];
    let series = [];
    for(let i = mu_hat_min; i < mu_hat_max; i += step) {
        graph.push(normal_log_likelihood(data, i, variance_hat))
        series.push(i);
    }
    return [graph, series];
}

/** @type {function(number[], number, number): number[][]} */
export function deriv_norm_log_likelihood_mu(data, mu_hat, variance_hat) {

    const fineness = 10;

    let step = variance_hat / fineness;

    let mu_hat_min = mu_hat - (variance_hat * 3);
    let mu_hat_max = mu_hat + (variance_hat * 3);

    let graph = [];
    let series = [];
    for(let i = mu_hat_min; i < mu_hat_max; i += step) {
        let sum = 0;
        for(let j = 0; j < data.length; j++) {
            sum += (data[j] - i)
        }
        sum *= (1 / variance_hat)
        //sum /= data.length
        graph.push(sum)
        series.push(i);
    }
    return [graph, series];
}