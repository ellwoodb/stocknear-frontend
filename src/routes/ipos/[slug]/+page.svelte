<script lang='ts'>
import { goto } from '$app/navigation';
import {formatString, abbreviateNumber} from '$lib/utils';
import { screenWidth } from '$lib/store';
import ScrollToTop from '$lib/components/ScrollToTop.svelte';

import InfiniteLoading from '$lib/components/InfiniteLoading.svelte';

export let data;

let rawData;;
let totalIPOs = 0;
let ipoList;
let year;
let isLoaded = false;
let displayMonth = 'all'

async function infiniteHandler({ detail: { loaded, complete } }) 
{

  if (ipoList?.length === rawData?.length) {
      complete();
    } 
    else {
      const nextIndex = ipoList?.length;
      const newHoldings = rawData?.slice(nextIndex, nextIndex + 50);
      ipoList = [...ipoList, ...newHoldings];
      loaded();
    }
}


const monthMap = {
  jan: "01",
  feb: "02",
  march: "03",
  april: "04",
  may: "05",
  june: "06",
  july: "07",
  aug: "08",
  sept: "09",
  oct: "10",
  nov: "11",
  dec: "12"
};

async function changeTimePeriod(event)
  {
    isLoaded = false;
    displayMonth = event.target.value;
    const monthValue = monthMap[displayMonth];
    if (displayMonth !== 'all') {
      rawData = data?.getIPOCalendar?.filter(item => item?.date?.includes(`-${monthValue}-`));
    }
    else {
      rawData = data?.getIPOCalendar;
    }

    ipoList = rawData?.slice(0, 50);
    
  
    isLoaded = true;

  }


$: {
  if(typeof window !== 'undefined') {
    
    const monthValue = monthMap[displayMonth];
    if (displayMonth !== 'all') {
      rawData = data?.getIPOCalendar?.filter(item => item?.date?.includes(`-${monthValue}-`));
    }
    else {
      rawData = data?.getIPOCalendar;
    }
    
    totalIPOs = data?.getIPOCalendar?.length;
    ipoList = rawData?.slice(0,50);
    year =  data?.getYear;
    isLoaded = true
  }
}

let charNumber = 40;
$: {
    if ($screenWidth < 640)
    {
      charNumber = 20;
    }
    else {
      charNumber = 40;
    }
  }
  

        
</script>

  
<section class="w-full max-w-4xl overflow-hidden m-auto p-5 sm:p-0 ">
          
    

  {#if isLoaded}

<div class="flex flex-col justify-center items-center p-5 sm:p-0">

  
  <div class="mt-0 sm:mt-5 mb-2 w-full sm:flex sm:flex-row sm:items-center m-auto text-gray-100 font-medium border border-gray-800 sm:rounded-lg h-auto p-5">
    <svg class="w-5 h-5 inline-block sm:mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path fill="#a474f6" d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m-4 48a12 12 0 1 1-12 12a12 12 0 0 1 12-12m12 112a16 16 0 0 1-16-16v-40a8 8 0 0 1 0-16a16 16 0 0 1 16 16v40a8 8 0 0 1 0 16"/></svg>
    There have been {totalIPOs} IPOs on the US stock market in {year}.
  </div>

  <div class="mr-auto flex flex-col jusitfy-start items-start ml-2 mb-5 mt-5">
    <div class="text-white text-md font-medium mr-2">
      Select Time period
    </div>
      <div class="relative mt-4">
        <select class="select text-white select-bordered select-sm w-36 p-0 pl-5 overflow-y-auto bg-[#2A303C]" on:change={changeTimePeriod}>
            <option disabled>Select time period</option>
            <option value="all" selected>All</option>
            <option value="jan">January</option>
            <option value="feb">February</option>
            <option value="march">March</option>
            <option value="april">April</option>
            <option value="may">May</option>
            <option value="june">June</option>
            <option value="july">July</option>
            <option value="aug">August</option>
            <option value="sept">September</option>
            <option value="oct">October</option>
            <option value="nov">November</option>
            <option value="dec">December</option>
        </select>
      </div>
  </div>


  {#if rawData?.length !== 0}
    {#if $screenWidth > 640}
    <table class="mt-5 table table-sm table-compact rounded-none sm:rounded-md w-full bg-[#09090B] border-bg-[#09090B] m-auto overflow-hidden">
      <thead>
        <tr>
          <th class="text-white font-medium text-[0.95rem] text-start">IPO Date</th>
          <th class="text-white font-medium text-[0.95rem] hidden sm:table-cell text-start">Symbol</th>
          <th class="text-white font-medium text-sm sm:text-[0.95rem]">Name</th>
          <th class="text-white font-medium text-end text-sm sm:text-[0.95rem]l">IPO Price</th>
          <th class="text-white font-medium text-end text-sm sm:text-[0.95rem]">Current Price</th>
          <th class="text-white font-medium text-end text-sm sm:text-[0.95rem]">Return</th>
        </tr>
      </thead>
      <tbody>
        {#each ipoList as item,index}
        <tr on:click={() => goto("/stocks/"+item?.symbol)} class="sm:hover:bg-[#245073] sm:hover:bg-opacity-[0.2] odd:bg-[#27272A] border-b-[#09090B] shake-ticker cursor-pointer">
          

          <td class="text-white text-sm text-start border-b-[#09090B]">
            {new Date(item?.date)?.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', daySuffix: '2-digit' })}
          </td>


          <td class="hidden sm:table-cell text-blue-400 text-sm text-start border-b-[#09090B]">
            {item?.symbol}
          </td>

          <td class="text-gray-200 border-b-[#09090B]">
            <span class="hidden sm:block text-white">{item?.name?.length > charNumber ? formatString(item?.name?.slice(0,charNumber)) + "..." : formatString(item?.name)}</span>
            <div class="sm:hidden flex flex-row">
              <div class="flex flex-col">
                <span class="text-blue-400 ">{item?.symbol}</span>
                <span class="text-white">{item?.name?.length > charNumber ? formatString(item?.name?.slice(0,charNumber)) + "..." : formatString(item?.name)}</span>
              </div>
            </div>
          </td>
        
        
          <td class="text-white border-b-[#09090B] text-end">
            {item?.ipoPrice !== null ? '$'+item?.ipoPrice : '-'}
          </td>

        <td class="text-white border-b-[#09090B] text-end">
          {item?.currentPrice !== null ? '$'+item?.currentPrice : '-'}
        </td>

    

        <td class="text-white border-b-[#09090B] text-end flex flex-row items-center justify-end">
          {#if item?.return >=0 && item?.return !== null}
            <svg class="w-5 h-5 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g id="evaArrowUpFill0"><g id="evaArrowUpFill1"><path id="evaArrowUpFill2" fill="#10db06" d="M16.21 16H7.79a1.76 1.76 0 0 1-1.59-1a2.1 2.1 0 0 1 .26-2.21l4.21-5.1a1.76 1.76 0 0 1 2.66 0l4.21 5.1A2.1 2.1 0 0 1 17.8 15a1.76 1.76 0 0 1-1.59 1Z"/></g></g></svg>
            <span class="inline-block text-[#10DB06] text-md">{abbreviateNumber(item?.return)}%</span>
          {:else if item?.return < 0 && item?.return !== null}
            <svg class="w-5 h-5 mt-0.5 rotate-180" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g id="evaArrowUpFill0"><g id="evaArrowUpFill1"><path id="evaArrowUpFill2" fill="#FF2F1F" d="M16.21 16H7.79a1.76 1.76 0 0 1-1.59-1a2.1 2.1 0 0 1 .26-2.21l4.21-5.1a1.76 1.76 0 0 1 2.66 0l4.21 5.1A2.1 2.1 0 0 1 17.8 15a1.76 1.76 0 0 1-1.59 1Z"/></g></g></svg>    
            <span class="inline-block text-[#FF2F1F] text-md">{abbreviateNumber(item?.return)}% </span> 
          {:else}
            <span class="inline-block text-white text-md">
              -
            </span> 
          {/if}
        </td>


        </tr>
        {/each}
        <InfiniteLoading on:infinite={infiniteHandler} />


      </tbody>
    </table>

    {:else}

    <div class="relative sm:hidden pt-3 w-full">
      {#each ipoList as item}
        <div class="bg-[#09090B] rounded-lg border border-slate-800 shadow-lg h-auto pb-3 pl-2 pr-2 pt-4 mb-7">
            <div class="flex flex-row items-center">
              <label on:click={() => goto("/stocks/"+item?.symbol)} class="cursor-pointer flex flex-col ml-3 w-40">
                <span class="text-blue-400">{item?.symbol}</span>
                <span class="text-slate-300 text-sm">{item?.name?.length > charNumber ? formatString(item?.name?.slice(0,charNumber)) + "..." : formatString(item?.name)}</span>
              </label>

              <div class="flex flex-col justify-end items-end ml-auto">
                <span class="font-medium text-slate-300 text-ends">IPO Date</span>
                <span class="text-white text-opacity-[0.8] text-md text-end">
                  {item?.date !== null ? new Date(item?.date)?.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', daySuffix: '2-digit' }) : '-'}
                </span>
              </div>
            </div>
            <div class="border-1 border-b border-slate-800 w-full mt-5 mb-5" />

            <div class="flex flex-row items-center">
              <div class="flex flex-col ml-3 w-40">
                <span class="font-medium text-slate-300">IPO Price</span>
                <span class="text-white text-md">
                  {item?.ipoPrice !== null ? '$'+item?.ipoPrice : '-'}
                </span>
              </div>

              <div class="flex flex-col justify-end items-end ml-auto">
                <span class="font-medium text-slate-300 text-ends">Current Price</span>
                <span class="text-white text-md text-end">
                  {item?.currentPrice !== null ? '$'+item?.currentPrice : '-'}
                </span>
              </div>
            </div>

            <div class="border-1 border-b border-slate-800 w-full mt-5 mb-5" />


            <div class="flex flex-row items-center">
              <div class="flex flex-col ml-3 w-40">
                <span class="font-medium text-slate-300">Market Cap</span>
                <span class="text-white text-md">
                  {item?.marketCap !== null && item?.marketCap !== 0 ? abbreviateNumber(item?.marketCap,true) : '-'}
                </span>
              </div>

              <div class="flex flex-col justify-end items-end ml-auto">
                <span class="font-medium text-slate-300 text-ends">Return</span>
                <span class="text-white text-md text-end">
                  <div class="flex flex-row mt-1">
                    {#if item?.return >=0 && item?.return !== null}
                      <svg class="w-5 h-5 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g id="evaArrowUpFill0"><g id="evaArrowUpFill1"><path id="evaArrowUpFill2" fill="#10db06" d="M16.21 16H7.79a1.76 1.76 0 0 1-1.59-1a2.1 2.1 0 0 1 .26-2.21l4.21-5.1a1.76 1.76 0 0 1 2.66 0l4.21 5.1A2.1 2.1 0 0 1 17.8 15a1.76 1.76 0 0 1-1.59 1Z"/></g></g></svg>
                      <span class="text-[#10DB06] text-md">+{abbreviateNumber(item?.return)}%</span>
                    {:else if item?.return < 0 && item?.return !== null}
                      <svg class="w-5 h-5 mt-0.5 rotate-180" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g id="evaArrowUpFill0"><g id="evaArrowUpFill1"><path id="evaArrowUpFill2" fill="#FF2F1F" d="M16.21 16H7.79a1.76 1.76 0 0 1-1.59-1a2.1 2.1 0 0 1 .26-2.21l4.21-5.1a1.76 1.76 0 0 1 2.66 0l4.21 5.1A2.1 2.1 0 0 1 17.8 15a1.76 1.76 0 0 1-1.59 1Z"/></g></g></svg>    
                      <span class="text-[#FF2F1F] text-md">{abbreviateNumber(item?.return)}% </span> 
                    {:else}
                      <span class="text-[#FF2F1F] text-md">
                        -
                      </span> 
                    {/if}
                  </div>
                </span>
              </div>
            </div>


        </div>
      {/each}

      <ScrollToTop />

    </div>


    {/if}
    <InfiniteLoading on:infinite={infiniteHandler} />
  {:else}
    <div class="flex justify-center items-center m-auto mt-10 mb-6">
      <div class="text-gray-100 text-center text-sm sm:text-[1rem] rounded-lg h-auto border border-slate-800 p-4">
      <svg class="w-5 h-5 inline-block sm:mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path fill="#a474f6" d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m-4 48a12 12 0 1 1-12 12a12 12 0 0 1 12-12m12 112a16 16 0 0 1-16-16v-40a8 8 0 0 1 0-16a16 16 0 0 1 16 16v40a8 8 0 0 1 0 16"/></svg>
      No IPOs found. Please adjust your search timeframe for the latest {year} IPOs.
      </div>
  </div>
  {/if}

</div>

  {:else}
  <div class="flex justify-center items-center h-80">
    <div class="relative">
    <label class="bg-[#09090B] rounded-xl h-14 w-14 flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <span class="loading loading-spinner loading-md"></span>
    </label>
    </div>
</div>

    {/if}





</section>