<script>
    import { onMount } from 'svelte';
    import Chart from 'chart.js/auto';
    import annotationPlugin from 'chartjs-plugin-annotation';

    Chart.register(annotationPlugin);

    export let ll_data = [[0,0]];
    export let mle_data = [[0,0], [0,0]]

    let chart;

    /** @type {function(number[][], number[][]): void} */
    export const redraw = (update_data_ll = [], update_data_mle = []) => {
        let old_data = chart.config.data;
        old_data.datasets[0].data.length = 0;
        old_data.datasets[1].data.length = 0;
        old_data.labels.length = 0
        for(let i = 0; i < update_data_ll[0].length ; i++){
            old_data.labels.push(update_data_ll[1][i]);
            old_data.datasets[0].data.push(update_data_ll[0][i]);
        }
        for(let i = 0; i < update_data_mle[0].length ; i++){
            //old_data.labels.push(update_data_mle[1][i]);
            old_data.datasets[1].data.push(update_data_mle[0][i]);
        }
        chart.update();
    }

    onMount(() => {
            
        const ctx = document.getElementById('likelihoodGraph');
        if(ctx) {
            chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ll_data[1],
                    datasets: [
                        {
                            label: 'Log-Likelihood',
                            data: ll_data[0],
                            borderColor: '#ff6384',
                            backgroundColor: '#ff6384',
                            borderWidth: 2,
                            pointRadius: 1,
                            tension: 0.4,
                        },
                        {
                            label: 'Maximum Likelihood Estimator',
                            data: mle_data[0],
                            borderColor: '#36a2eb',
                            backgroundColor: '#36a2eb',
                            borderWidth: 2,
                            pointRadius: 1,
                            tension: 0.4
                        },
                    ]
                },
                options: {
                    responsive: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Estimators'
                        },
                        annotation: {
                            annotations: {
                                line1: {
                                    type: 'line',
                                    yMin: 0,
                                    yMax: 0,
                                    borderColor: '#444444',
                                    borderWidth: 2,
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                            // For a category axis, the val is the index so the lookup via getLabelForValue is needed
                            callback: function(val, index) {
                                // Hide every 2nd tick label
                                return index % 2 === 0 ? this.getLabelForValue(val) : '';
                            },
                            color: 'black',
                            }
                        },
                    },
                },
            });
        }
    
    });

</script>

<div class="fullrow">
    <canvas id="likelihoodGraph"></canvas>
    <span class="stats">
    </span>
</div>

<style>
    #likelihoodGraph {
        width: 800px;
    }
    .stats {
        display: flex;
        flex-direction: row;
        align-items: baseline;
        justify-content: center;
        gap: 0.5em;
    }
    .fullrow {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 1rem;
    }
</style>