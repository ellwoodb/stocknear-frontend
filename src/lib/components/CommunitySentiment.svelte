<script lang='ts'>
    import { stockTicker, displayCompanyName } from "$lib/store";
    import toast from 'svelte-french-toast';

    export let communitySentiment = {};

    let upvote = 0;
    let downvote = 0;
    let totalVote = 0;
    let upvotePercentage = 50;
    let downvotePercentage = 50;

    let alreadyVoted;

async function updateSentiment(sentiment:string) {
    if(!alreadyVoted) {

        if(sentiment === 'upvote') {
            upvote +=1
        }
        else if(sentiment === 'downvote') {
            downvote +=1
        }
        alreadyVoted = sentiment;
        calculateStats()


        const postData = {
        'ticker': $stockTicker,
        'sentiment': sentiment,
        'sentimentId': communitySentiment?.sentimentData?.id
        }

        const response = await fetch('/api/community-sentiment', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json","X-API-KEY": apiKey
        },
        body: JSON.stringify(postData),
        }); // make a POST request to the server with the FormData object

        const output = await response.json();
        if(output !== 'success') {
            toast.error('Something went wrong. Please try again!', {
                style: 'border-radius: 10px; background: #383838; color: #fff;',
            });
        }
    }
    else {
        toast.success('You have already voted 🗳️ ', {
            style: 'border-radius: 10px; background: #383838; color: #fff;',
        });
    }
}

function calculateStats() {
    totalVote = upvote+downvote;
    if(totalVote === 0) {
        upvotePercentage = 50;
        downvotePercentage = 50;
    } else {
        upvotePercentage = ((upvote/totalVote)*100)?.toFixed(0)
        downvotePercentage = 100 - upvotePercentage;
    }
}

$: {
    if(typeof window !== 'undefined' && $stockTicker && communitySentiment) {
       alreadyVoted = communitySentiment?.alreadyVoted ;
       upvote = communitySentiment?.sentimentData?.upvote ?? 0;
       downvote = communitySentiment?.sentimentData?.downvote ?? 0;
       calculateStats()

    }
}

</script>
    
    
    


<div class="space-y-3 overflow-hidden">

    <div class="flex flex-col items-center w-full mb-6">
        <div class="flex flex-row justify-start mr-auto items-center">
          <!--<img class="h-10 inline-block mr-2" src={copilotIcon} />-->
          <div class="flex flex-col items-start">
            <label class="mr-1 cursor-pointer flex flex-row items-center text-white text-xl sm:text-lg font-semibold">
              What do you think of {$stockTicker} today?
            </label>
            <span class="text-white text-sm sm:text-[1rem] mt-1">
                The community is {upvote > downvote ? 'bullish' : upvote < downvote ? 'bearish' : 'neutral'} about {$displayCompanyName} today.
            </span>
            </div>

        </div>
    </div>

    <div class="flex flex-row items-center gap-x-3 sm:gap-x-4 w-full">
        <label on:click={() => updateSentiment('upvote')} class="{alreadyVoted === 'upvote' ? 'bg-[#31528C]' : 'bg-[#313131] sm:hover:bg-[#383838] sm:transition sm:duration-100 sm:ease-out'} cursor-pointer text-gray-100 px-3 py-2 w-fit rounded-lg flex flex-row items-center">
            <svg class="w-5 h-5" version="1.1" id="Layer_2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 128 128" style="enable-background:new 0 0 128 128;" xml:space="preserve"><polygon style="fill:#CA2C31;" points="3.77,71.73 20.11,55.63 47.93,50.7 45.18,65.26 7.57,76.82 5.14,75.77 "/><polygon style="fill:#A02422;" points="22.94,59.76 5.2,75.88 18.25,82.24 38.06,72.13 38.06,67.36 42.11,56.44 "/><path style="fill:#A02422;" d="M64.92,88.15l-8.57,3.72l-8.09,17.15c0,0,7.12,15.77,7.44,15.77c0.32,0,4.37,0.32,4.37,0.32  l14.4-16.1l3.64-27.5L64.92,88.15z"/><path style="fill:#CA2C31;" d="M56.5,100.84c0,0,4.77-0.97,8.17-2.59c3.4-1.62,7.6-4.04,7.6-4.04l-1.54,13.43l-15.05,17.13  c0,0-0.59-0.73-3.09-6.17c-1.99-4.34-2.68-5.89-2.68-5.89L56.5,100.84z"/><path style="fill:#F7D74D;" d="M31.58,80.66c0,0-5.74-0.48-12.03,7.47c-5.74,7.26-8.43,19.08-9.47,22.12s-3.53,3.66-2.7,5.05  s4.42,1.31,8.85,0.76s8.23-1.94,8.23-1.94s-0.19,0.48-0.83,1.52c-0.23,0.37-1.03,0.9-0.97,1.45c0.14,1.31,11.36,1.34,20.32-7.88  c9.68-9.95,4.98-18.11,4.98-18.11L31.58,80.66z"/><path style="fill:#FBF0B4;" d="M33.31,85.29c0,0-6.19,0.33-11.31,8.28s-7.5,17.16-7.01,17.78c0.48,0.62,10.02-2.83,12.31-2.14  c1.57,0.48,0.76,2.07,1.18,2.49c0.35,0.35,4.49,0.94,11.19-6.32c6.71-7.26,5.12-17.46,5.12-17.46L33.31,85.29z"/><path style="fill:#858585;" d="M36.35,74.44c0,0-3.11,2.77-4.22,4.36c-1.11,1.59-1.11,1.73-1.04,2.21  c0.07,0.48,1.22,5.75,6.01,10.37c5.88,5.67,11.13,6.43,11.89,6.43c0.76,0,5.81-5.67,5.81-5.67L36.35,74.44z"/><path style="fill:#437687;" d="M50.1,91.24c0,0,5.04,3.31,13.49,0.47c11.55-3.88,20.02-12.56,30.51-23.52  c10.12-10.58,18.61-23.71,18.61-23.71l-5.95-19.93L50.1,91.24z"/><path style="fill:#3F545F;" d="M67.99,80.33l1.39-4.32l3.48,0.49c0,0,2.65,1.25,4.6,2.16c1.95,0.91,4.46,1.6,4.46,1.6l-4.95,4.18  c0,0-2.7-1.02-4.67-1.88C70.08,81.59,67.99,80.33,67.99,80.33z"/><path style="fill:#8DAFBF;" d="M84.32,16.14c0,0-9.62,5.58-23.41,18.63c-12.43,11.76-21.64,22.4-23.87,31.45  c-1.86,7.58-0.87,12.18,3.36,17.15c4.47,5.26,9.71,7.87,9.71,7.87s3.94,0.06,20.38-12.59c20.51-15.79,36.94-42.23,36.94-42.23  L84.32,16.14z"/><path style="fill:#D83F22;" d="M104.18,41.84c0,0-8.37-3.57-14.34-11.9c-5.93-8.27-5.46-13.86-5.46-13.86s4.96-3.89,16.11-8.34  c7.5-2.99,17.71-4.52,21.07-2.03s-2.3,14.98-2.3,14.98l-10.31,19.96L104.18,41.84z"/><path style="fill:#6896A5;" d="M68.17,80.4c0,0-7.23-3.69-11.83-8.94c-8.7-9.91-10.5-20.79-10.5-20.79l4.37-5.13  c0,0,1.09,11.56,10.42,21.55c6.08,6.51,12.43,9.49,12.43,9.49s-1.27,1.07-2.63,2.11C69.56,79.36,68.17,80.4,68.17,80.4z"/><path style="fill:#A02422;" d="M112.71,44.48c0,0,4.34-5.23,8.45-17.02c5.74-16.44,0.74-21.42,0.74-21.42s-1.69,7.82-7.56,18.69  c-4.71,8.71-10.41,17-10.41,17s3.14,1.41,4.84,1.9C110.91,44.25,112.71,44.48,112.71,44.48z"/><path style="fill:#B3E1EE;" d="M39.81,69.66c1.3,1.24,3.27-0.06,4.56-3.1c1.3-3.04,1.28-4.74,0.28-5.46  c-1.24-0.9-3.32,1.07-4.23,2.82C39.42,65.86,38.83,68.72,39.81,69.66z"/><path style="fill:#B3E1EE;" d="M84.95,20.13c0,0-7.61,5.47-15.73,12.91c-7.45,6.83-12.39,12.17-13.07,13.41  c-0.72,1.33-0.73,3.21-0.17,4.17s1.8,1.46,2.93,0.62c1.13-0.85,9.18-9.75,16.45-16.11c6.65-5.82,11.78-9.51,11.78-9.51  s2.08-3.68,1.74-4.52C88.54,20.25,84.95,20.13,84.95,20.13z"/><path style="fill:#ED6A65;" d="M84.95,20.13c0,0,5.62-4.31,11.74-7.34c5.69-2.82,11.35-5.17,12.37-3.13  c0.97,1.94-5.37,4.58-10.95,8.14c-5.58,3.56-10.95,7.81-10.95,7.81s-0.82-1.5-1.35-2.89C85.22,21.21,84.95,20.13,84.95,20.13z"/><path style="fill:#E1E1E1;" d="M89.59,39.25c-5.57-5.13-13.32-3.75-17.14,0.81c-3.92,4.7-3.63,11.88,1,16.2  c4.21,3.92,12.04,4.81,16.76-0.69C94.41,50.69,94.15,43.44,89.59,39.25z"/><path style="fill:#3F545F;" d="M75.33,41.87c-3.31,3.25-3.13,9.69,0.81,12.63c3.44,2.57,8.32,2.44,11.38-0.69  c3.06-3.13,3.06-8.82,0.19-11.76C84.41,38.68,79.12,38.15,75.33,41.87z"/><path style="fill:#A02524;" d="M50,76.89c0,0,6.19-6.28,6.87-5.6c0.68,0.68,0.59,4.49-2.37,8.73c-2.97,4.24-9.5,11.79-14.67,16.88  c-5.1,5.01-12.29,10.74-12.97,10.64c-0.53-0.08-2.68-1.15-3.54-2.19c-0.84-1.03,1.67-5.9,2.68-7.51C27.02,96.23,50,76.89,50,76.89z"/><path style="fill:#CA2C31;" d="M21.23,101.85c-0.08,1.44,2.12,3.54,2.12,3.54L56.87,71.3c0,0-1.57-1.77-6.19,1.1  c-4.66,2.9-8.74,6.38-14.76,12.21C27.53,92.75,21.31,100.41,21.23,101.85z"/><path style="fill:#FFFFFF;" d="M19.06,36.95c-1.11,1.11-1.16,2.89,0.08,3.91c1.1,0.91,2.89,0.32,3.56-0.5s0.59-2.6-0.3-3.48  C21.51,35.99,19.74,36.28,19.06,36.95z"/><path style="opacity:0.5;fill:#FFFFFF;" d="M41.02,35.65c-0.84,0.93-0.57,2.31,0.21,2.82s1.95,0.46,2.52-0.24  c0.51-0.63,0.57-1.89-0.21-2.67C42.86,34.89,41.56,35.05,41.02,35.65z"/><path style="fill:#FFFFFF;" d="M55.55,11.89c0,0,1.22-3.48,1.94-3.52c0.73-0.04,1.78,3.48,1.78,3.48s3.61,0.04,3.85,0.57  c0.31,0.68-2.31,2.96-2.31,2.96s0.85,3.4,0.45,3.81c-0.45,0.45-3.56-1.34-3.56-1.34s-3.2,2.23-3.89,1.62  c-0.6-0.53,0.65-4.13,0.65-4.13s-3-2.19-2.84-2.8C51.85,11.68,55.55,11.89,55.55,11.89z"/><path style="fill:#FFFFFF;" d="M97.01,95.33c1.21,0.67,2.73,0.29,3.29-1c0.51-1.15-0.43-2.52-1.28-2.89  c-0.85-0.37-2.34,0.12-2.88,1.09C95.61,93.49,96.28,94.93,97.01,95.33z"/><path style="fill:#FFFFFF;" d="M114.19,65.84c-0.69-1.07-2.18-1.42-3.15-0.56c-0.94,0.84-0.71,2.16-0.18,2.83  c0.53,0.67,1.95,0.92,2.81,0.37S114.61,66.48,114.19,65.84z"/></svg>
            <span class="ml-2 text-white text-xs font-bold">{upvotePercentage}%</span>
        </label>
        <label on:click={() => updateSentiment('downvote')} class="{alreadyVoted === 'downvote' ? 'bg-[#BC111A]' : 'bg-[#313131] sm:hover:bg-[#383838] sm:transition sm:duration-100 sm:ease-out'} cursor-pointer text-gray-100 px-3 py-2 w-fit rounded-lg flex flex-row items-center border border-[#313131]">
            <svg class="w-5 h-5" version="1.1" id="f44e" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 128 128" style="enable-background:new 0 0 128 128;" xml:space="preserve"><g>	<g>		<g>			<path style="fill:#FFCA28;" d="M115.53,29.39c-0.83-5.37-3.63-9.59-7.44-9.9c-1.62-0.13-3.4-0.07-3.4-0.07     c1.99-0.7,3.94-4.29,2.15-9.61c-1.68-4.97-5.53-6.19-11.67-5.36c-1.59,0.22-10.03,1.64-12.94,1.57     c-13.53-0.34-27.95-0.87-37.84,6.4C40,15.3,36.75,19.65,30.92,20.2c-6.08,0.58-10,0.56-14.99-0.12     c-1.03-0.14-2.02,0.45-2.37,1.43c-1.85,5.2-6.64,21.86-0.77,41.99c0.32,1.11,1.43,1.8,2.56,1.57c3.26-0.67,10.24-1.47,17.74,1.63     c5.37,2.22,6.83,9.29,13.99,14.03c17,11.29,15.62,27.54,15.04,36.13c-0.34,5.04,3.33,7.62,9,6.89     c8.93-1.14,12.49-13.5,12.06-24.18c-0.23-5.59-2.16-10.78-3.47-14.41c-2.5-6.93,1.76-5.74,5.31-4.88     c12.04,2.91,18.49,2.95,18.49,2.95c5.49-0.31,9.6-4.47,10.07-9.54c0.51-5.55-0.65-9.01-1.99-10.23     c3.65-0.57,5.99-5.55,6.39-10.72c0.27-3.52-1.29-10.69-5.95-11.93C114.8,39.09,116.22,33.87,115.53,29.39z"/>			<path style="fill:#FFB300;" d="M90.13,42.77c-6.38,1.39-7.01,12.68-2.67,15.35c1.64,1.01,1.27,4.08,1.27,4.08     c-2.09,0.61-4.02,2.68-4.34,7.47c-0.33,5,3.11,8.23,3.11,8.23s-5.03,0.36-7.17-2.69c-2.69-3.83-4.58-14.5-6.47-19.37     c-2.39-6.17-7.76-11.51-12.73-14.44c7.41-3.22,9.06-18.62,12.73-25.93S84.94,7.45,84.64,7.9c-1.46,2.21-1.54,6.92-1.17,8.44     c1.41,5.86,5.93,5.34,5.93,5.34l0.63,2.26c0,0-3.28,2.73-3.28,7.73c0,5.72,3.15,7.63,3.15,7.63L90.13,42.77z"/>		</g>		<path style="fill:#EDA600;" d="M33.74,59.6c0,0,1.25,2.58,5.34,8.68c1.74,2.6,4.55,5.95,8.86,9.63c4.45,3.79,7.85,8.49,8.17,11.25    c-1.89-2.73-6.21-6.54-9.04-8.42C40.12,76.12,33.09,66.71,33.74,59.6z"/>	</g>	<path style="fill:#EDA600;" d="M85.69,25.35c-1.41,0.28-4.91,2.69-4.83,7.85c0.06,4.42,2.77,5.43,4.07,5.94   c0,0,13.06,0.2,21.74,0.06c2.82,0,5.5,1.63,5.5,1.63s-2.49,1.61-5.65,1.74c-14.26,0.57-20.58,0.3-22.81,0.7   c0,0-3.97,0.14-4.36,7.08c-0.41,7.29,5.27,7.22,6.69,7.49c1.42,0.27,15.47,2.32,19.06,2.88c4.47,0.7,6.29,2.73,6.29,2.73   s-0.8,0.27-4.87,0.06c-3.62-0.18-13.07-1.06-20.47-1.4c-1.07-0.05-5.59,0.69-6.08,5.01c-0.27,2.36-0.32,5.18,0.63,7.09   c1.31,3.51,12.44,4.8,18.15,5.76c10.27,1.72,13.11-1.49,13.11-1.49c-2.22,5.41-8.98,5.68-15.75,4.56   c-0.75-0.12-11.93-1.6-14.35-1.99c-1.79-0.29-2.42,0.99-0.99,5.02c3.7,10.42,2.28,18.85,2.28,18.85s-0.63-4.63-1.86-8.54   s-3.08-7.93-5.38-11.81c-2.2-3.69-1.3-9.03-1.63-18.88s-5.16-17.4-12.69-22.2c-0.76-0.34-1.68-1.54-0.68-2.1   c1.38-0.08,2.81,0.43,4.08,0.96c3.06,1.26,7.25,3.29,10.2,7.69c-0.07-5.04,1.73-7.98,3.98-9.43c-1.81-1.5-2.64-3.48-2.63-8.18   c0.01-4.43,1.67-6.56,3.39-7.94c-1.87-0.86-3.57-2.44-4.18-5.21c-0.73-3.28-0.83-6.04,0.21-8.24c-0.02-0.01-0.05-0.02-0.06-0.04   c-5.04-4-19.41-1.35-24.73,1.43c-8.49,4.43-9.9,6.94-12.42,8.71c-2.35,2.62-4.22,5.67-5.46,8.96c-0.32-2.75-0.13-4.84,0.63-6.91   c-6,1.53-12.89-1.14-15.38-1.74c-2.64-0.63-2.96-1.49-2.96-1.49c11.62,0.65,14.3,0.49,17.54-0.35C38.85,18.1,40.59,11.47,54,7.7   c6.44-1.81,17.33-2.47,30.86-2.79c5.49-1.14,12.23-0.7,12.23-0.7S83,7.66,80.55,10.55c-0.47,0.55-2.76,4.06-0.04,9.44   c1.04,2.05,3.37,1.72,5.46,1.59c0.74-0.05,12.38-1.38,15.46-1.92c4.93-0.87,7.85,0.09,7.85,0.09s-3.62,1.79-6.41,2.3   C99.87,22.59,87.1,25.07,85.69,25.35z"/></g></svg>
            <span class="ml-2 text-white text-xs font-bold">{downvotePercentage}%</span>
        </label>
    </div>
</div>
