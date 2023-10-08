
<script>
    import { onMount } from 'svelte';
    //import MathJax from "mathjax";
    import Hist from '../hist.svelte';
    import { randn_bm } from '../random';
    import { deriv_norm_log_likelihood_mu, graph_normal_log_likelihood, log_likelihood, normal_log_likelihood, normal_pdf, round, roundArr } from '../math';
    import Graph from '../graph.svelte';

    let equ1 = `$$x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}$$`;
    let models = {
        normalModel: {
            form: `$$X_i \\sim \\mathcal{N}(\\mu, \\sigma^2)$$`,
            parameters: {
                mean: 0,
                variance: 1
            }
        },
        uniformModel: {
            form: `$$X_i \\sim U(a, b)$$`,
            parameters: {
                a: 0,
                b: 1
            }
        },
    }
    let pModel = null;
    let probabilisticModel = "Normal";
    let probabilityTheta = `$$X_1 ,...,X_n \\overset{\\mathrm{iid}}{\\sim} P(x | \\theta) \\equiv$$`

    function handleProbabilisticModelChange() {
        switch(probabilisticModel) {
            case 'Normal':
            default:
                pModel = models.normalModel;
                break;
            case 'Uniform':
                pModel = models.normalModel;
                break;
            case 'Bernoulli':
                pModel = models.normalModel;
                break;
        }
        console.log(pModel)
    }

    /**
     * @type {Array<Number>}
     */
    let X;
    /**
     * @type {Array<Number>}
     */
    let XFreq;
    /**
     * @type {Array<Number>}
     */
    let XFreqLabels;

    let N = 1000;
    let numBuckets = 50;
    let variance = 1;
    let mean = 0;
    let XMean = 0;

    const precision = 4;

    /** @type {function(number, number, number, number): void} */
    function simulateNormalDist(N = 1000, mean = 0, variance = 1, numBuckets = 50) {
        
        console.log(mean)
        X = [];
        for(let i = 0; i < N; i++) {
            X.push(((randn_bm() - 0.5) * variance) + mean)
        }
        XFreq = Array(numBuckets).fill(0);
        let XMax = Math.max.apply(null, X);
        let XMin = Math.min.apply(null, X);
        XMean = round((X.reduce((a, b) => a + b) / X.length));
        let bucketWidth = (XMax - XMin) / numBuckets;

        X.map((x) => {
            /**
             * @type {number}
             */
            let delta = (1/X.length)
            let index = (Math.round(((x - XMin) / bucketWidth)))
            XFreq[index] += delta
        })
        
        XFreqLabels = Array(numBuckets).fill(0);
        for(let i = 0; i < numBuckets; i++) {
            let avgOfBucket = ((XMin + (i * bucketWidth)) + (XMin + ((i + 1) * bucketWidth))) / 2
            XFreqLabels[i] = round(avgOfBucket);
        }
    }

    let loglikelihood_fn = `$$\\mathcal{LL}(\\theta) \\equiv log(P(x_{1:n} | \\theta)) \\equiv log(\\prod_{i = 1}^{n} P(x | \\theta))$$`;
    let loglikelihood_value = Infinity;

    let muHat = 0;
    let varianceHat = 1;

    function findLogLikelihood() {
        switch(probabilisticModel) {
            case 'Normal':
            default: {
                loglikelihood_value = round(normal_log_likelihood(X, muHat, varianceHat))
                graphLogLikelihood()
                graphMLE()
            }
        }
    }


    /**
     * @type {function}
     */
    let redrawChart = () => {};

    function resimulate() {
        console.log("resims")
        simulateNormalDist(N, mean, variance, numBuckets);
        //console.log(XFreq)
        redrawChart(XFreq, XFreqLabels);
    }
    resimulate();

    /**
     * @type {number[][]}
     */
    let LLData;
    let redrawLLGraph = () => {};

    function graphLogLikelihood() {
        LLData = graph_normal_log_likelihood(X, muHat, varianceHat)
        LLData[1] = roundArr(LLData[1]);
        console.log(LLData[0])
        graphMLE()
        redrawLLGraph(LLData, MLEData);
    }

    /**
     * @type {number[][]}
     */
    let MLEData;
    function graphMLE() {
        MLEData = deriv_norm_log_likelihood_mu(X, muHat, varianceHat)
        MLEData[1] = roundArr(MLEData[1]);
        console.log(MLEData[0])
        redrawLLGraph(LLData, MLEData);
    }

    onMount(() => {
            
        let script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js";
        document.head.append(script);
        
        // script.onload = () => {
        //     MathJax = {
        //         tex: {inlineMath: [['$', '$'], ['\\(', '\\)']]},
        //         svg: {fontCache: 'global'}
        //     };
        //     window.MathJax = MathJax;
        // };

	});

    // function typesetMath(str) {
    //     MathJax.tex2svgPromise(str).then((node) => {
    //         const container = document.getElementById("mathjax-container");
    //         container.appendChild(node);
    //     });
    // }
    

</script>

<main>
    <h1>ProbX calculator</h1>
    <div class="fullrow">
        <div id="probabilisticModel">
            <label for="probabilisticModel">Probabilistic Model:</label>
            <select bind:value={probabilisticModel} on:change={handleProbabilisticModelChange}>
                <option>Normal</option>
                <option>Uniform</option>
                <option>Bernoulli</option>
                <option>Poisson</option>
            </select>
        </div>
        <div class="row">
            <label for="probabilisticModel">{'$$N =$$'}</label>
            <input type="number" bind:value={N}>
            <label for="probabilisticModel">{'$$\\mu =$$'}</label>
            <input type="number" bind:value={mean}>
            <label for="probabilisticModel">{'$$\\sigma^2 =$$'}</label>
            <input type="number" bind:value={variance}>
            <button on:click={resimulate}>Resimulate</button>
        </div>
    </div>
    
    <div class="fullrow">
        <div class="row">
            <p>{probabilityTheta}</p>
            <p id="normalModel" style:display={probabilisticModel === "Normal" ? 'block' : 'none'}>
                {models.normalModel.form}
            </p>
            <p id="uniformModel" style:display={probabilisticModel === "Uniform" ? 'block' : 'none'}>
                {models.uniformModel.form}
            </p>
    
        </div>
        <Hist data={XFreq} labels={XFreqLabels} mean={XMean} bind:redraw={redrawChart}/>
    </div>
    
    <div class="fullrow">
        <div class="row">
            <h4 id="likelihoodFunction">Log-Likelihood Function:</h4>
            {#if probabilisticModel === "Normal"}
                <label for="probabilisticModel">{'$$\\hat{\\mu} =$$'}</label>
                <input type="number" bind:value={muHat}>
                <label for="probabilisticModel">{'$$\\hat{\\sigma}^2 =$$'}</label>
                <input type="number" bind:value={varianceHat}>
            {/if}
        </div>
        <button on:click={findLogLikelihood}>Calculate</button>
    </div>
    <div class="fullrow">
        <div class="row">
            <p>
                {loglikelihood_fn}
            </p>
        </div>
        <div class="row">
            <p>{'$$\\mathcal{LL}(\\hat{\\mu}, \\hat{\\sigma^2})=$$'}</p>
            <p>{loglikelihood_value}</p>
        </div>
    </div>
    <Graph ll_data={LLData} mle_data={MLEData} bind:redraw={redrawLLGraph}/>
   
</main>


<style type="text/scss" lang="scss">
    .fullrow {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
    }
    .row {
        display: flex;
        flex-direction: row;
        align-items: baseline;
        gap: 0.5em;
    }
    .row * {
            margin: 0 !important;
    }
</style>

