<script lang="ts">

import {stockTicker, similarTickerClicked, screenWidth} from '$lib/store';
import { goto } from '$app/navigation';
import { abbreviateNumber } from '$lib/utils';


export let similarstock;
  
  
  
  async function stockSelector(state)
  {
    window?.scroll({ top: 0, left: 0, behavior: 'smooth' });
    stockTicker.update(value => state);
    $similarTickerClicked = true;    
    goto("/stocks/"+state+"/")
  }
  
  
  
  

  </script>
  <!--Start Similar Stocks Card -->
  
  <div class="space-y-3 sm:pt-5 hidden lg:block lg:{similarstock?.length !== 0 ? '' : 'hidden'}">  
  
  <div class="sm:rounded-2xl shadow-lg bg-[#000] sm:bg-[#09090B] sm:border sm:border-slate-800 h-auto {$screenWidth < 640 ? 'w-screen pt-16' : ''} md:w-96">
  
    <div class="w-auto lg:w-full p-1 flex flex-col m-auto pb-14 sm:pb-10 px-2 sm:px-0">
      <h2 class="text-start text-2xl font-semibold text-white p-3 mt-3 ml-1">
        Similar Stocks
      </h2>
      {#if similarstock?.length !== 0} 

      
  
      <div class="flex justify-start items-center w-full m-auto ">
        <table class="table table-sm table-compact mt-3 text-start flex justify-start items-center w-full px-3 m-auto">
          <thead>
            <tr class="border-b border-blue-400">
              <th class="text-white font-semibold text-sm text-start bg-[#000] sm:bg-[#09090B] border-b border-blue-400">Company</th>
              <th class="text-white font-semibold text-sm text-center bg-[#000] sm:bg-[#09090B] border-b border-blue-400">Market Cap</th>
              <th class="text-white font-semibold text-sm text-end bg-[#000] sm:bg-[#09090B] border-b border-blue-400">Avg Volume</th>
            </tr>
          </thead>
          <tbody>
            {#each similarstock as item, index}
            <tr on:click={() => stockSelector(item?.symbol)} class="shake-ticker text-white cursor-pointer sm:hover:bg-[#245073] sm:hover:bg-opacity-[0.2] bg-[#000] sm:bg-[#09090B] border-b border-[#000] sm:border-[#27272A]">
              {#if index <=6}
             
                <td class="text-gray-200">
                  <div class="flex flex-row items-center">
                    <div class="rounded-full w-10 h-10 relative  flex items-center justify-center">
                      <img style="clip-path: circle(50%);" class="w-6 h-6 rounded-full" src={`https://financialmodelingprep.com/image-stock/${item.symbol}.png`} loading="lazy"/>
                    </div>
                    <div class="flex flex-col ml-3 w-full">
                      <span class="text-blue-400 text-sm font-medium">{item?.symbol}</span>
                      <span class="text-white text-xs">
                        {#if typeof item?.name !== 'undefined'}
                          {item?.name?.length > 10 ? item?.name?.slice(0,10) + "..." : item?.name}
                        {:else}
                          n/a
                        {/if}
                      </span>
                    </div>
                  </div>
                  
                  
                </td>
            
              <td class="text-white text-center font-medium ">
                {item?.marketCap !== null ? abbreviateNumber(item?.marketCap,true) : '-'}
              </td>
            
              <td class="text-white font-medium text-end">
                {item?.avgVolume !== null ? abbreviateNumber(item?.avgVolume) : '-'}
              </td>
              {/if}
            </tr>
            {/each}
          </tbody>
        </table>
      </div>

      {:else}
      <div class=" mt-20 flex justify-center items-center text-2xl font-bold text-slate-700 mb-20 m-auto">
          No data available
      </div>
      {/if}
  
    
  </div>
  </div>
  </div>
  <!--End Similar Stocks Card -->    
  


<!--Start Mobile Similar Ticker Card-->
<div class="lg:hidden space-y-3 sm:pt-5">  
  
  <div class="bg-[#000] h-auto w-screen">
  
   <!--Start Header-->
   <div class="bg-[#09090B] w-full p-1 flex flex-col items-center pb-5 h-auto rounded-b-[30px]">
    <h2 class="text-center m-auto text-[1.1rem] font-medium text-white mt-5">
     Similar Ticker
    </h2>
    <div class="flex flex-col items-center mt-10 w-full">
      <span class="text-white text-center text-md text-opacity-[0.8] pl-8 pr-8">
        Identify trends in similar assets and explore superior competing options in your portfolio.
      </span>

      <div class="flex flex-row justify-center items-center w-full mt-5">
      </div>

    </div>

  </div>
  <!--End Header-->

    {#if similarstock?.length !== 0}
    <div class="flex justify-start items-center w-full m-auto mt-10 overflow-hidden">
      <table class="table table-sm table-compact mt-3 text-start flex justify-start items-center w-full px-3 m-auto">
        <thead>
          <tr class="border-b border-blue-400">
            <th class="text-white font-bold text-sm text-start bg-[#000] border-b border-blue-400">Company</th>
            <th class="text-white font-bold text-sm text-center bg-[#000] border-b border-blue-400">Market Cap</th>
            <th class="text-white font-bold text-sm text-end bg-[#000] border-b border-blue-400">Avg Volume</th>
          </tr>
        </thead>
        <tbody>
          {#each similarstock as item, index}
          <tr on:click={() => stockSelector(item?.symbol)} class="text-white cursor-pointer bg-[#000] border-b border-[#000]">
            {#if index <=6}
           
              <td class="text-gray-200">
                <div class="flex flex-row items-center">
                  <div class="rounded-full w-10 h-10 relative flex items-center justify-center">
                    <img style="clip-path: circle(50%);" class="w-6 h-6 rounded-full" src={`https://financialmodelingprep.com/image-stock/${item.symbol}.png`} loading="lazy"/>
                  </div>
                  <div class="flex flex-col ml-3 w-full">
                    <span class="text-blue-400 text-sm font-medium">{item?.symbol}</span>
                    <span class="text-white text-xs">
                      {#if typeof item?.name !== 'undefined'}
                        {item?.name?.length > 10 ? item?.name?.slice(0,10) + "..." : item?.name}
                      {:else}
                        n/a
                      {/if}
                    </span>
                  </div>
                </div>
                
                
              </td>
          
            <td class="text-white text-center font-medium ">
              {item?.marketCap !== null ? abbreviateNumber(item?.marketCap,true) : '-'}
            </td>
          
            <td class="text-white font-medium text-end">
              {item?.avgVolume !== null ? abbreviateNumber(item?.avgVolume) : '-'}
            </td>
            {/if}
          </tr>
          {/each}
        </tbody>
      </table>
    </div>

    {:else}
    <div class=" mt-20 flex justify-center items-center text-2xl font-bold text-slate-700 mb-20 m-auto">
        No data available
    </div>
    {/if}


  </div>
  </div>
<!--End Mobile Similar Ticker Card-->
  