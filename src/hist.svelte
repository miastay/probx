<script>
    import { onMount } from 'svelte';
    import Chart from 'chart.js/auto';

    /**
     * @type {Chart}
     */
    var chart;

    /**
     * @type {Array<Number>}
     */
    export let data = [2];//: 
    /**
     * @type {Array<Number>}
     */
    export let labels = [0];
    export let mean = 0;

    /** @type {function(number[], number[]): void} */
    export const redraw = (update_data, update_labels) => {
        console.log(update_data)
        let old_data = chart.config.data;
        old_data.datasets[0].data.length = 0;
        old_data.labels.length = 0
        for(let i = 0; i < update_data.length ; i++){
            old_data.labels.push(update_labels[i]);
            old_data.datasets[0].data.push(update_data[i]);
        }
        chart.update();
    }

    onMount(() => {
            
        const ctx = document.getElementById('myChart');
        if(ctx) {
            chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels ?? data.map((x) => {return ''}),
                    datasets: [{
                        label: '',
                        data: data,
                        borderWidth: 0
                    }]
                },
                options: {
                    scales: {
                        x: {
                            beginAtZero: true
                        },
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        legend: {
                            display: false,
                        },
                        title: {
                            display: true,
                            text: "Probability Density"
                        }
                    }
                }
            });
        }

    });

    

   

</script>

<div>
    <canvas id="myChart"></canvas>
    <span class="stats">
        {`$$\\bar{x}=$$`}{mean}
    </span>
</div>

<style>
    #myChart {
        width: 400px;
    }
    .stats {
        display: flex;
        flex-direction: row;
        align-items: baseline;
        justify-content: center;
        gap: 0.5em;
    }
</style>