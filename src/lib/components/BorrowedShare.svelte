<script lang ='ts'>
    import { borrowedShareComponent, displayCompanyName, stockTicker, assetType, etfTicker, screenWidth, userRegion, getCache, setCache} from '$lib/store';
    import InfoModal from '$lib/components/InfoModal.svelte';
    import { Chart } from 'svelte-echarts'
    import { abbreviateNumber, formatDateRange } from "$lib/utils";
  
    import Lazy from 'svelte-lazy';
    export let data;
  
    let isLoaded = false;
    const usRegion = ['cle1','iad1','pdx1','sfo1'];
  
    let apiURL;
let apiKey = import.meta.env.VITE_STOCKNEAR_API_KEY;

  
    userRegion.subscribe(value => {
  
        if (usRegion.includes(value)) {
        apiURL = import.meta.env.VITE_USEAST_API_URL;
        } else {
        apiURL = import.meta.env.VITE_EU_API_URL;
        }
    });
  
  
    let rawData = [];
    let optionsData;
    let avgFee;
    let lowestFee;
    let highestFee;
    let monthlyAvailableShares;
    let totalAvailableShares;
  

function findLowestAndHighestFee(data, lastDateStr) {
    // Convert lastDateStr to Date object
    const lastDate = new Date(lastDateStr);
  
    // Set the first date to the beginning of the month of lastDate
    const firstDate = new Date(lastDate.getFullYear(), lastDate.getMonth(), 1);
  
    // Filter data to include only prices within the specified month period
    const filteredData = data.filter(item => {
        const currentDate = new Date(item?.date);
        return currentDate >= firstDate && currentDate <= lastDate;
    });
    	
    // Extract prices from filtered data
    let fees = filteredData?.map(item => parseFloat(item?.fee));
    monthlyAvailableShares = filteredData?.reduce((accumulator, currentItem) => {
        return accumulator + currentItem?.available;
    }, 0);

    // Find the lowest and highest prices
    lowestFee = Math.min(...fees)?.toFixed(1);
    highestFee = Math.max(...fees)?.toFixed(1);
}

  
  function normalizer(value) {
  if (Math?.abs(value) >= 1e18) {
    return { unit: 'Q', denominator: 1e18 };
  } else if (Math?.abs(value) >= 1e12) {
    return { unit: 'T', denominator: 1e12 };
  } else if (Math?.abs(value) >= 1e9) {
    return { unit: 'B', denominator: 1e9 };
  } else if (Math?.abs(value) >= 1e6) {
    return { unit: 'M', denominator: 1e6 };
  } else if (Math?.abs(value) >= 1e5) {
    return { unit: 'K', denominator: 1e5 };
  } else {
    return { unit: '', denominator: 1 };
  }
  }
  
  
  function getPlotOptions() {
    let dates = [];
    let availableList = [];
    let feeList = [];
    // Iterate over the data and extract required information
    rawData?.forEach(item => {
  
    dates?.push(item?.date);
    availableList?.push(item?.available);
    feeList?.push(item?.fee)
    });
    
    // Find the lowest and highest prices
    findLowestAndHighestFee(rawData, rawData?.slice(-1)?.at(0)?.date)

    // Compute the average of item?.traded
    const totalNumber = feeList?.reduce((acc, item) => acc + item, 0);
    avgFee = (totalNumber / feeList?.length)?.toFixed(1);
    totalAvailableShares = availableList?.reduce((accumulator, sum) => {
        return accumulator + sum;
    }, 0);

    const {unit, denominator } = normalizer(Math.max(...availableList) ?? 0)
  
    const option = {
    silent: true,
    tooltip: {
        trigger: 'axis',
        hideDelay: 100, // Set the delay in milliseconds
    },
    animation: $screenWidth < 640 ? false: true,
    grid: {
        left: '2%',
        right: '2%',
        bottom: '2%',
        top: '5%',
        containLabel: true
    },
    xAxis:
    {
        type: 'category',
        boundaryGap: false,
        data: dates,
    },
    yAxis: [
    { 
        type: 'value',
        splitLine: {
            show: false, // Disable x-axis grid lines
        },
        axisLabel: {
            color: '#6E7079', // Change label color to white
            formatter: function (value, index) {
                // Display every second tick
                if (index % 2 === 0) {
                    value = Math.max(value, 0);
                    return (value / denominator)?.toFixed(0) + unit; // Format value in millions
                } else {
                    return ''; // Hide this tick
                }
            }
        },
    },
    {
      type: 'value',
      splitLine: {
            show: false, // Disable x-axis grid lines
      },
      position: 'right',
      axisLabel: {
          formatter: function (value, index) {
            if (index % 2 === 0) {
              return value?.toFixed(1)+'%'
            } else {
                  return ''; // Hide this tick
              }
          }
      }
    },
    ],
    series: [
        {
            data: availableList,
            type: 'line',
            itemStyle: {
                color: '#fff' // Change bar color to white
            },
            showSymbol: false
        },
        {
            data: feeList,
            type: 'line',
            areaStyle: {opacity: 0.3},
            yAxisIndex: 1,
            itemStyle: {
                color: '#FF9E21' // Change bar color to white
            },
            showSymbol: false
        },
    ]
    };
  
  
  return option;
  }
  
  const getBorrowedShare = async (ticker) => {
    // Get cached data for the specific tickerID
    const cachedData = getCache(ticker, 'getBorrowedShare');
    if (cachedData) {
      rawData = cachedData;
    } else {
  
      const postData = {'ticker': ticker};
      // make the POST request to the endpoint
      const response = await fetch(apiURL + '/borrowed-share', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json", "X-API-KEY": apiKey
        },
        body: JSON.stringify(postData)
      });
  
      rawData = (await response.json())?.slice(-100);
      // Cache the data for this specific tickerID with a specific name 'getBorrowedShare'
      setCache(ticker, rawData, 'getBorrowedShare');
    }
    
    if(rawData?.length !== 0) {
      $borrowedShareComponent = true;
    } else {
      $borrowedShareComponent = false;
    }
  };
  
  
  $: {
  if($assetType === 'stock' ? $stockTicker :$etfTicker && typeof window !== 'undefined') {
    isLoaded=false;
    const ticker = $assetType === 'stock' ? $stockTicker :$etfTicker
    const asyncFunctions = [
      getBorrowedShare(ticker)
      ];
      Promise.all(asyncFunctions)
          .then((results) => {
            optionsData = getPlotOptions()
          })
          .catch((error) => {
            console.error('An error occurred:', error);
          });
    isLoaded = true;
  
  }
  }
  
  let charNumber = 20;
  
  $: {
  if($screenWidth < 640)
  {
    charNumber = 20;
  }
  else {
    charNumber =40;
  }
  }
    
  
  
  </script>
    
    
    
  <section class="overflow-hidden text-white h-full pb-8">
    <main class="overflow-hidden ">
                    
        <div class="flex flex-row items-center">
            <label for="borrowedShareInfo" class="mr-1 cursor-pointer flex flex-row items-center text-white text-xl sm:text-3xl font-bold">
                Borrowed Share
            </label>
            <InfoModal
              title={"Borrowed Share Statistics"}
              content={"At Interactive Brokers, borrowed shares refer to shares lent by other investors for short selling. Borrowers pay a fee to lenders, aiming to profit from declining stock prices. Lenders earn interest on their lent shares, enhancing returns while still owning the stock."}
              id={"borrowedShareInfo"}
            />
        </div>
  
        {#if data?.user?.tier === 'Pro'}
        {#if isLoaded}
  
        {#if rawData?.length !== 0}
  
        <div class="w-full flex flex-col items-start">
            <div class="text-white text-sm sm:text-[1rem] mt-2 mb-2 w-full">
                Over the past six months, Interactive Brokers had {abbreviateNumber(totalAvailableShares)} shares available for borrowing, with an average fee of {avgFee}%.
            </div>
        </div>
  
        <div class="pb-2 rounded-lg bg-[#09090B]">
                
          
            <Lazy height={300} fadeOption={{delay: 100, duration: 500}} keep={true}>
                <div class="app w-full h-[300px] mt-5">
                    <Chart options={optionsData} class="chart" />
                </div>
            </Lazy>
        
        </div>
  
        <div class="flex flex-row items-center justify-between mx-auto mt-5 w-full sm:w-11/12">
            <div class="mt-3.5 sm:mt-0 flex flex-col sm:flex-row items-center ml-3 sm:ml-0 w-1/2 justify-center">
            <div class="h-full transform -translate-x-1/2 " aria-hidden="true"></div>
            <div class="w-3 h-3 bg-[#fff] border-4 box-content border-[#27272A] rounded-full transform sm:-translate-x-1/2" aria-hidden="true"></div>
            <span class="mt-2 sm:mt-0 text-white text-center sm:text-start text-xs sm:text-md inline-block">
                Available Shares
            </span>
        </div>
            <div class="flex flex-col sm:flex-row items-center ml-3 sm:ml-0 w-1/2 justify-center">
                <div class="h-full transform -translate-x-1/2 " aria-hidden="true"></div>
                <div class="w-3 h-3 bg-[#FF9E21] border-4 box-content border-[#27272A] rounded-full transform sm:-translate-x-1/2" aria-hidden="true"></div>
                <span class="mt-2 sm:mt-0 text-white text-xs sm:text-md sm:font-medium inline-block">
                    Fee
                </span>
            </div>
  
        </div>
  
  
        <h2 class="mt-10 mr-1 flex flex-row items-center text-white text-xl sm:text-2xl font-bold mb-3">
            Latest Information
        </h2>
  
  
          <div class="flex justify-start items-center w-full m-auto ">
            <table class="w-full" data-test="statistics-table">
              <tbody>
                  <tr class="border-y border-gray-800 odd:bg-[#27272A]">
                      <td class="px-[5px] py-1.5 xs:px-2.5 xs:py-2">
                          <span>Date</span>
                      </td>
                      <td class="px-[5px] py-1.5 text-right text-sm sm:text-[1rem] font-medium xs:px-2.5 xs:py-2">
                        {formatDateRange(rawData?.slice(-1)?.at(0)?.date)}
                      </td>
                  </tr>
                  <tr class="border-y border-gray-800 odd:bg-[#27272A]">
                      <td class="px-[5px] py-1.5 xs:px-2.5 xs:py-2">
                          <span>Fee Range</span>
                      </td>
                      <td class="px-[5px] py-1.5 text-right font-medium xs:px-2.5 xs:py-2">
                        {lowestFee+'%'+'-'+highestFee+'%'}
                      </td>
                  </tr>
                  <tr class="border-y border-gray-800 odd:bg-[#27272A]">
                      <td class="px-[5px] py-1.5 xs:px-2.5 xs:py-2">
                          <span>Total Available Shares</span>
                      </td>
                      <td class="px-[5px] py-1.5 text-right font-medium xs:px-2.5 xs:py-2">
                        {abbreviateNumber(monthlyAvailableShares)}
                      </td>
                  </tr>
              </tbody>
          </table>
          </div>
  
  
        
        {/if}
  
        {:else}
        <div class="flex justify-center items-center h-80">
            <div class="relative">
            <label class="bg-[#09090B] rounded-xl h-14 w-14 flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span class="loading loading-spinner loading-md"></span>
            </label>
            </div>
        </div>
        {/if}
  
        {:else}
        <div class="shadow-lg shadow-bg-[#000] bg-[#09090B] sm:bg-opacity-[0.5] text-sm sm:text-[1rem] rounded-md w-full p-4 min-h-24 mt-4 text-white m-auto flex justify-center items-center text-center font-semibold">
            <svg class="mr-1.5 w-5 h-5 inline-block"xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#A3A3A3" d="M17 9V7c0-2.8-2.2-5-5-5S7 4.2 7 7v2c-1.7 0-3 1.3-3 3v7c0 1.7 1.3 3 3 3h10c1.7 0 3-1.3 3-3v-7c0-1.7-1.3-3-3-3M9 7c0-1.7 1.3-3 3-3s3 1.3 3 3v2H9z"/></svg>
            Unlock content with <a class="inline-block ml-2 text-blue-400 hover:sm:text-white" href="/pricing">Pro Subscription</a>
          </div>
        {/if}
  
    </main>
  </section>
  
  
  
  
  <style>
  
  .app {
  height: 300px;
  max-width: 100%; /* Ensure chart width doesn't exceed the container */
  
  }
  
  @media (max-width: 640px) {
  .app {
    height: 210px;
  }
  }
  
  .chart {
  width: 100%;
  }
  
  </style>