<script lang='ts'>

  import { onMount } from 'svelte';
 
  import * as Avatar from "$lib/components/shadcn/avatar/index.js";
  import { Button } from "$lib/components/shadcn/button/index.ts";
  import * as Card from "$lib/components/shadcn/card/index.ts";
  import * as Table from "$lib/components/shadcn/table/index.ts";
  import ArrowUpRight from "lucide-svelte/icons/arrow-up-right";
  import Zap from "lucide-svelte/icons/zap";
  import Bomb from "lucide-svelte/icons/bomb";
  import Crown from "lucide-svelte/icons/crown";
  import Activity from "lucide-svelte/icons/activity";
  import { abbreviateNumber, formatDate, formatString } from '$lib/utils';
  
  import {  numberOfUnreadNotification} from '$lib/store';

  export let data;

  const quickInfo = data?.getDashboard?.quickInfo;

function latestInfoDate(inputDate) {
    // Convert the input date string to milliseconds since epoch
    const inputDateMs = Date?.parse(inputDate);

    // Get today's date in milliseconds since epoch
    const todayMs = Date?.now();

    // Calculate the difference in milliseconds
    const differenceInMs = todayMs - inputDateMs;

    // Convert milliseconds to days
    const differenceInDays = Math?.floor(differenceInMs / (1000 * 60 * 60 * 24));

    // Return the difference in days
    return differenceInDays <=1;
}



let Feedback;

onMount( async() => {
    Feedback = (await import('$lib/components/Feedback.svelte')).default   
})




</script>
  
  


<svelte:head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width" />
  <title>
    {$numberOfUnreadNotification > 0 ? `(${$numberOfUnreadNotification})` : ''} Free Stock Analysis Information for Small Investors · stocknear
  </title>

  <meta name="description" content="Stocknear has everything you need to analyze stocks with help of AI, including detailed financial data, statistics, news and charts.">
  <!-- Other meta tags -->
  <meta property="og:title" content="Free Stock Analysis Information for Small Investors · stocknear"/>
  <meta property="og:description" content="Stocknear has everything you need to analyze stocks with help of AI, including detailed financial data, statistics, news and charts."/>
  <meta property="og:type" content="website"/>
  <!-- Add more Open Graph meta tags as needed -->

  <!-- Twitter specific meta tags -->
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="Free Stock Analysis Information for Small Investors · stocknear"/>
  <meta name="twitter:description" content="Stocknear has everything you need to analyze stocks with help of AI, including detailed financial data, statistics, news and charts."/>
  <!-- Add more Twitter meta tags as needed -->
</svelte:head>



<div class="w-full max-w-screen overflow-hidden m-auto min-h-screen bg-[#09090B]">
    
    <div class="flex flex-col w-full max-w-7xl m-auto justify-center items-center">
      <div class="text-center mb-10 w-full px-4 sm:px-3 mt-10">                
      
        {#if Feedback}
          <Feedback data={data} />
        {/if}
        
        <div class="text-center mb-5 relative w-fit flex justify-center m-auto">
          <a href="/cramer-tracker" class="text-white antialiased bg-[#27272A] w-full px-4 py-2 rounded-xl m-auto font-medium text-sm flex items-center">
            <span class="font-semibold">Realtime Jim Cramer Stock Picks Tracker</span>
          </a>
          <div class="absolute top-[-1.2rem] -right-5 sm:-right-8 rotate-[7deg]">
            <span class="bg-[#FBCE3C] text-black text-sm sm:text-[0.9rem] rounded-xl font-semibold sm:me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
              New
            </span>
          </div>
        </div>

        <h1 class="text-white text-3xl font-semibold text-start w-full pl-4 pb-4 sm:pb-2">
          Dashboard
        </h1>

    

        <main class="flex flex-1 flex-col gap-4 sm:p-4 md:gap-8">
          <div class="grid gap-4 grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Card.Root>
              <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
                <Card.Title class="text-start text-[1rem] sm:text-xl font-semibold">Most Active</Card.Title>
                <Activity class="h-4 w-4 shrink-0" />
              </Card.Header>
              <Card.Content>
                <a href={`/stocks/${quickInfo?.active?.symbol}`} class="flex text-start text-blue-400 sm:hover:text-white text-[1rem] sm:text-lg font-semibold">{quickInfo?.active?.symbol}</a>
                <p class="text-start text-[1rem] sm:text-lg font-medium text-white mt-1">
                  <!--${quickInfo?.active?.price}-->
                      {#if quickInfo?.active?.changesPercentage >=0}
                      <svg class="hidden sm:inline-block w-5 h-5 -mr-0.5 -mt-0.5 inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g id="evaArrowUpFill0"><g id="evaArrowUpFill1"><path id="evaArrowUpFill2" fill="#10db06" d="M16.21 16H7.79a1.76 1.76 0 0 1-1.59-1a2.1 2.1 0 0 1 .26-2.21l4.21-5.1a1.76 1.76 0 0 1 2.66 0l4.21 5.1A2.1 2.1 0 0 1 17.8 15a1.76 1.76 0 0 1-1.59 1Z"/></g></g></svg>
                      <span class="text-[#10DB06] font-medium">+{quickInfo?.active?.changesPercentage?.toFixed(2)}%</span>
                    {:else}
                      <svg class="hidden sm:inline-block w-5 h-5 -mr-0.5 -mt-0.5 inline-block rotate-180" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g id="evaArrowUpFill0"><g id="evaArrowUpFill1"><path id="evaArrowUpFill2" fill="#FF2F1F" d="M16.21 16H7.79a1.76 1.76 0 0 1-1.59-1a2.1 2.1 0 0 1 .26-2.21l4.21-5.1a1.76 1.76 0 0 1 2.66 0l4.21 5.1A2.1 2.1 0 0 1 17.8 15a1.76 1.76 0 0 1-1.59 1Z"/></g></g></svg>    
                      <span class="text-[#FF2F1F] font-medium">{quickInfo?.active?.changesPercentage?.toFixed(2)}% </span> 
                    {/if}
                </p>
              </Card.Content>
            </Card.Root>
            <Card.Root >
              <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
                <Card.Title class="text-start text-[1rem] sm:text-xl font-semibold">Biggest Winner</Card.Title>
                <Crown class="h-4 w-4 shrink-0" />
              </Card.Header>
              <Card.Content>
                <a href={`/stocks/${quickInfo?.winner?.symbol}`} class="flex text-start text-blue-400 sm:hover:text-white text-[1rem] sm:text-lg font-semibold">{quickInfo?.winner?.symbol}</a>
                <p class="text-start text-[1rem] sm:text-lg font-medium text-white mt-1">
                  <!--${quickInfo?.winner?.price}-->
                      {#if quickInfo?.winner?.changesPercentage >=0}
                      <svg class="hidden sm:inline-block w-5 h-5 -mr-0.5 -mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g id="evaArrowUpFill0"><g id="evaArrowUpFill1"><path id="evaArrowUpFill2" fill="#10db06" d="M16.21 16H7.79a1.76 1.76 0 0 1-1.59-1a2.1 2.1 0 0 1 .26-2.21l4.21-5.1a1.76 1.76 0 0 1 2.66 0l4.21 5.1A2.1 2.1 0 0 1 17.8 15a1.76 1.76 0 0 1-1.59 1Z"/></g></g></svg>
                      <span class="text-[#10DB06] font-medium">+{abbreviateNumber(quickInfo?.winner?.changesPercentage?.toFixed(2))}%</span>
                    {:else}
                      <svg class="hidden sm:inline-block w-5 h-5 -mr-0.5 -mt-0.5 rotate-180" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g id="evaArrowUpFill0"><g id="evaArrowUpFill1"><path id="evaArrowUpFill2" fill="#FF2F1F" d="M16.21 16H7.79a1.76 1.76 0 0 1-1.59-1a2.1 2.1 0 0 1 .26-2.21l4.21-5.1a1.76 1.76 0 0 1 2.66 0l4.21 5.1A2.1 2.1 0 0 1 17.8 15a1.76 1.76 0 0 1-1.59 1Z"/></g></g></svg>    
                      <span class="text-[#FF2F1F] font-medium">{abbreviateNumber(quickInfo?.winner?.changesPercentage?.toFixed(2))}% </span> 
                    {/if}
                </p>
              </Card.Content>
            </Card.Root>
            <Card.Root>
              <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
                <Card.Title class="text-start text-[1rem] sm:text-xl font-semibold">Biggest Loser</Card.Title>
                <Bomb class="h-4 w-4 shrink-0" />
              </Card.Header>
              <Card.Content>
                <a href={`/stocks/${quickInfo?.loser?.symbol}`} class="flex text-start text-blue-400 sm:hover:text-white text-[1rem] sm:text-lg font-semibold">{quickInfo?.loser?.symbol}</a>
                <p class="text-start text-[1rem] sm:text-lg font-medium text-white mt-1">
                  <!--${quickInfo?.loser?.price?.toFixed(2)}-->
                      {#if quickInfo?.loser?.changesPercentage >=0}
                      <svg class="hidden sm:inline-block w-5 h-5 -mr-0.5 -mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g id="evaArrowUpFill0"><g id="evaArrowUpFill1"><path id="evaArrowUpFill2" fill="#10db06" d="M16.21 16H7.79a1.76 1.76 0 0 1-1.59-1a2.1 2.1 0 0 1 .26-2.21l4.21-5.1a1.76 1.76 0 0 1 2.66 0l4.21 5.1A2.1 2.1 0 0 1 17.8 15a1.76 1.76 0 0 1-1.59 1Z"/></g></g></svg>
                      <span class="text-[#10DB06] font-medium">+{abbreviateNumber(quickInfo?.loser?.changesPercentage?.toFixed(2))}%</span>
                    {:else}
                      <svg class="hidden sm:inline-block w-5 h-5 -mr-0.5 -mt-0.5 rotate-180" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g id="evaArrowUpFill0"><g id="evaArrowUpFill1"><path id="evaArrowUpFill2" fill="#FF2F1F" d="M16.21 16H7.79a1.76 1.76 0 0 1-1.59-1a2.1 2.1 0 0 1 .26-2.21l4.21-5.1a1.76 1.76 0 0 1 2.66 0l4.21 5.1A2.1 2.1 0 0 1 17.8 15a1.76 1.76 0 0 1-1.59 1Z"/></g></g></svg>    
                      <span class="text-[#FF2F1F] font-medium">{abbreviateNumber(quickInfo?.loser?.changesPercentage?.toFixed(2))}% </span> 
                    {/if}
                </p>
              </Card.Content>
            </Card.Root>
            <Card.Root>
              <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
                <Card.Title class="text-start text-[1rem] sm:text-xl font-semibold">Most Shorted</Card.Title>
                <Zap class="h-4 w-4 shrink-0" />
              </Card.Header>
              <Card.Content>
                <a href={`/stocks/${quickInfo?.shorted?.symbol}`} class="flex text-start text-blue-400 sm:hover:text-white text-[1rem] sm:text-lg font-semibold">{quickInfo?.shorted?.symbol}</a>
                <p class="text-start text-[1rem] sm:text-lg font-medium text-[#FF2F1F] mt-1">
                  Short: {quickInfo?.shorted?.shortOutStandingPercent?.toFixed(2)}%
                </p>
              </Card.Content>
            </Card.Root>
          </div>

          <div class="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 text-start">
            <Card.Root class="xl:col-span-2 overflow-x-scroll">
              <Card.Header class="flex flex-row items-center">
                <div class="flex flex-col items-start w-full">
                  <div class="flex flex-row w-full items-center">
                    <Card.Title class="text-xl sm:text-2xl tex-white font-semibold">Hottest Options Contract</Card.Title>
                    <a href="/options-flow" class="ml-auto rounded-lg text-xs sm:text-sm px-2 sm:px-3 py-2 font-semibold bg-white text-black">
                      View All
                      <ArrowUpRight class="hidden sm:inline-block h-4 w-4 shrink-0 -mt-1 ml-0.5" />
                    </a>
                  </div>
                  <Card.Description class="mt-2">Recent hedge fund options with the highest premiums.</Card.Description>
                </div>
              </Card.Header>
              <Card.Content>
                <Table.Root class="overflow-x-scroll w-full no-scrollbar">
                  <Table.Header>
                    <Table.Row>
                      <Table.Head class="text-white">Symbol</Table.Head>
                      <Table.Head class="text-white">Prem.</Table.Head>
                      <Table.Head class="text-white">Strike</Table.Head>
                      <Table.Head class="text-white">Sent.</Table.Head>
                      <Table.Head class="text-white">C/P</Table.Head>
                      <Table.Head class="text-right text-white">Expiry</Table.Head>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {#each data?.getDashboard?.optionsFlow as item}
                    <Table.Row>
                      <Table.Cell>
                        <a href={item?.assetType === 'stock' ? `/stocks/${item?.ticker}` : `/etf/${item?.ticker}`} class="font-medium text-blue-400">{item?.ticker}</a>
                      </Table.Cell>
                      <Table.Cell class="xl:table.-column {item?.put_call === 'Calls' ? 'text-[#00FC50]' : 'text-[#FC2120]'}">
                        {abbreviateNumber(item?.cost_basis,true)}
                      </Table.Cell>
                      <Table.Cell class="xl:table.-column">
                        ${item?.strike_price}
                      </Table.Cell>
                      <Table.Cell class="md:table.-cell xl:table.-column {item?.sentiment === 'Bullish' ? 'text-[#00FC50]' : item?.sentiment === 'Bearish' ? 'text-[#FC2120]' : 'text-[#C6A755]'}">
                        {item?.sentiment}
                      </Table.Cell>
                      <Table.Cell class="md:table.-cell xl:table.-column {item?.put_call === 'Calls' ? 'text-[#00FC50]' : 'text-[#FC2120]'}">
                        {item?.put_call}
                      </Table.Cell>
                      
                      <Table.Cell class="text-right">07/26/24</Table.Cell>
                    </Table.Row>
                    {/each}
                  </Table.Body>
                </Table.Root>
              </Card.Content>
            </Card.Root>
            <Card.Root>
              <Card.Header>
                <Card.Title class="text-start text-xl w-full flex flex-row items-center">
                  <span>
                    Latest Congress Trading
                  </span>
                  <a href="/politicians/flow-data" class="ml-auto rounded-lg text-xs sm:text-sm px-2 sm:px-3 py-2 font-semibold bg-white text-black">
                    View All
                    <ArrowUpRight class="hidden sm:inline-block h-4 w-4 shrink-0 -mt-1 ml-0.5" />
                  </a>
                </Card.Title>
              </Card.Header>
              <Card.Content class="grid gap-y-4">
                {#each data?.getDashboard?.congressFlow as item}
                <div class="flex items-center gap-x-4">
                  <Avatar.Root class="h-12 w-12 border border-gray-800 flex-shrink-0 avatar {item?.party === 'Republican' ? 'bg-[#98272B]' : item?.party === 'Democratic' ? 'bg-[#295AC7]' : 'bg-[#20202E]'} sm:flex">
                    <Avatar.Image src={item?.image} alt="Avatar" />
                    <Avatar.Fallback>OM</Avatar.Fallback>
                  </Avatar.Root>
                  <div class="grid gap-1">
                    <p class="text-sm font-medium leading-none">{item?.representative?.replace('Dr','')}</p>
                    <p class="text-sm text-muted-foreground">{item?.party ?? 'n/a'}</p>
                  </div>
                  <div class="flex flex-col items-end justify-end text-lg ml-auto">
                    <a href={item?.ticker?.length !== 0 ? `/stocks/${item?.ticker}` : ''} class="text-sm {item?.ticker?.length !== 0 ? 'text-blue-400' : 'text-white cursor-text'} font-medium leading-none">
                      {item?.ticker?.length !== 0 ? item?.ticker : formatString(item?.assetDescription)?.slice(0,30) + '...'}
                    </a>
                    
                    <p class="text-sm text-white font-medium mt-1">{item?.amount?.replace("$1,000,001 - $5,000,000","$1Mio - $5Mio")}</p>
                    <p class="text-sm text-white font-medium mt-1">
                      {#if item?.type === 'Bought'}
                      <span class="text-[#10DB06]">Bought</span>
                      {:else if item?.type === 'Sold'}
                        <span class="text-[#FF2F1F]">Sold</span>
                      {/if}
                    </p>
                  </div>
                </div>
                {/each}
              </Card.Content>
            </Card.Root>
          </div>


          <div class="grid gap-4 sm:gap-8 sm:grid-cols-3 text-start">
            <Card.Root class="sm:col-span-2 overflow-x-scroll">
              <Card.Header class="flex flex-row items-center">
                <div class="text-start grid gap-2">
                  <Card.Title class="text-2xl tex-white font-semibold">Market Momentum</Card.Title>
                </div>
              </Card.Header>
              <Card.Content>
                {#each data?.getDashboard?.wiimFeed as item}
                  <div class="pb-4 sm:pb-6 border-b sm:border border-gray-800 sm:p-6 mb-4 rounded-none sm:rounded-lg text-start">
                    <div class="text-sm text-white">
                      <div class="flex flex-col items-start">
                        <div class="hidden sm:flex flex-row items-center mb-3">
                          {#if latestInfoDate(item?.date)}
                            <label class="bg-[#2D4F8A] text-white font-medium text-xs rounded-lg px-2 py-0.5">New</label>
                            <span class="ml-2 mr-2"> &#183;</span>
                          {/if}
                          <span class="text-gray-300 text-xs">
                            {formatDate(item?.date)} ago
                          </span>
                        </div>
                        <span class="text-white">{item?.text}</span>
                        <div class="flex flex-col mt-5 items-start w-full">
                          <div class="flex flex-wrap gap-y-3 flex-row items-center">
                            {#each item?.stocks as item2}
                              <div class="p-2 pt-1 sm:pt-2 pl-0">
                                <a href={item2?.assetType === 'stock' ? `/stocks/${item2?.ticker}` : item2?.assetType === 'etf' ? `/etf/${item2?.ticker}` : ''} class="cursor-pointer w-fit bg-[#404040] bg-opacity-[0.5] sm:hover:bg-opacity-[0.6] px-3 sm:px-4 py-1.5 sm:py-2 text-sm rounded-xl hover:text-white text-blue-400">
                                  {item2?.ticker}
                                </a>
                              </div>
                            {/each}
                          </div>
                          
                          <div class="sm:hidden flex flex-row items-center justify-end mt-3 ml-auto">
                            {#if latestInfoDate(item?.date)}
                              <label class="bg-[#2D4F8A] text-white font-medium text-xs rounded-lg px-2 py-0.5">New</label>
                              <span class="ml-2 mr-2"> &#183;</span>
                            {/if}
                            <span class="text-gray-300 text-xs">
                              {formatDate(item?.date)} ago
                            </span>
                          </div>

                        </div>
                      </div>
                      
                    </div>
                  </div>
                  {/each}
              </Card.Content>
            </Card.Root>
            <Card.Root>
              <Card.Header>
                <Card.Title class="text-start">Market News</Card.Title>
              </Card.Header>
              <Card.Content class="">
                <div class="mb-4 rounded-lg text-start">
                    {#each data?.getDashboard?.marketNews as item}
                      <div class="flex flex-col items-start pt-4 pb-4 border-t border-gray-800">
                        <div class="flex flex-row items-center mb-3">
                          <span class="text-gray-300 text-xs">
                            {formatDate(item?.date)} ago
                          </span>
                        </div>
                        <a href={item?.url} rel="noopener noreferrer" target="_blank" class="text-sm text-blue-400 sm:hover:text-white transition duration-100">
                          {item?.text}
                        </a>
                      </div>
                    {/each}
                    
                    
                </div>
             
              </Card.Content>
            </Card.Root>
          </div>
        </main>
      
        
     </div>

    </div>
</div>








  
<style>
   


.scrollbar {
    display: grid;
    grid-gap: 90px;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    grid-auto-flow: column;
    overflow-x: auto;
    scrollbar-width: thin; /* Hide the default scrollbar in Firefox */
    scrollbar-color: transparent transparent; /* Hide the default scrollbar in Firefox */
  }

  /* Custom scrollbar for Webkit (Chrome, Safari) */
  .scrollbar::-webkit-scrollbar {
    width: 0; /* Hide the width of the scrollbar */
    height: 0; /* Hide the height of the scrollbar */
  }

  .scrollbar::-webkit-scrollbar-thumb {
    background: transparent; /* Make the thumb transparent */
  }


  .stroke-text {
  font-size: 56px; /* Adjust the font size as needed */
  font-weight: bold; /* Adjust the font weight as needed */
  color: transparent; /* Make the text transparent */
  -webkit-text-stroke: 1px #CBD5E1; /* Add a black stroke outline with a thickness of 2px */
}


</style>