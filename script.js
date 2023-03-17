const options = {
	headers: {
	  'x-access-token':'coinranking3bc010e57b9cd5f21572bec15f5fddcba9341a9192c003cf' ,
	},
  };
  
// fetch('https://api.coinranking.com/v2/coins?limit=2', options)
// 	.then((response) => response.json())
// 	.then((result) => console.log(result));



//fetching elements

const coinList= document.querySelector('.coin-list');
const coinSearch= document.querySelector('.coin-search-list');
const searchInput=document.querySelector('[search-input]');
const searchBtn=document.querySelector('[search-btn]');
const newSearch=document.querySelector('.news-container');
const newsbycoinname=document.querySelector('[newsbycoinname]');
const newsBtn=document.querySelector('[search-news]');
const coinsearchlist=document.querySelector('.coin-search-list');
const clearsearch1=document.querySelector('.clear-search');



clearsearch1.addEventListener('click',(e)=>{
	e.preventDefault();
	clearsearch();
})

async function getCoins(){

	const data=await fetch('https://api.coinranking.com/v2/coins?limit=100', options);
	const dataJson= await data.json();	
	const dFrag=document.createDocumentFragment();

	for(let i=0;i<dataJson.data.coins.length;i++){

		let currency='';
		let pricecurrency=''
		const common=dataJson?.data?.coins[i];
		const imgvalue=dataJson?.data?.coins[i]?.iconUrl;
		let realprice=Math.round(common?.price);

		if(realprice<1){

			realprice=Math.round(common?.price*100);
			pricecurrency='cents';
		}else{
			realprice=Math.round(common?.price);
			pricecurrency='usd';
		}

		



		let marketCap=common?.marketCap;
		if(marketCap.length<=9 && marketCap.length>=8){
			marketCap=Math.round((common?.marketCap)/1000000);
			currency="million usd"
		}else{
			marketCap=Math.round((common?.marketCap)/1000000000);
			currency="billion usd"
		}
		
		const change=Math.round(common?.change);
		// const volume=Math.round((common?.['24hVolume'])/1000000000)
		let volume=common?.['24hVolume'];
		if(volume.length<=9 && volume.length>=8){
			volume=Math.round((volume)/1000000);
			currency="million usd"
		}else{
			volume=Math.round((volume)/1000000000);
			currency="billion usd"
		}

		const coinDiv=document.createElement('div');
		coinDiv.innerHTML=`<span>${dataJson?.data?.coins[i].rank}</span>
		<span>  <img src="${imgvalue}" width="20px" alt=""> ${dataJson?.data?.coins[i]?.name}</span>
		<span>${realprice} ${pricecurrency}</span>
		<span>${marketCap} ${currency} </span>
		<span>${common?.change}% </span>
		<span> ${volume} ${currency}</span>
		`

		// console.log(coinDiv);
		dFrag.appendChild(coinDiv);
	}

	coinList.appendChild(dFrag);

}
getCoins();


async function findCoins(){

	clearsearch();
	let  value= searchInput.value;

	const data= await fetch(`https://api.coinranking.com/v2/search-suggestions?query=${value}`, options)
	const dataJson=await data.json();
	// console.log(dataJson);
	
	const dFrag=document.createDocumentFragment();


	for(let i=0;i<dataJson.data.coins.length;i++){

		let currency=''
		const name=dataJson?.data?.coins[i]?.name;
		let price=dataJson?.data?.coins[i]?.price;

		if(price==null){
			price="not listed"
			currency=''
		}
		else{
			price=dataJson?.data?.coins[i]?.price;
			currency='usd'
		}

		const symbol=dataJson?.data?.coins[i]?.symbol;
		const imgvalue=dataJson?.data?.coins[i]?.iconUrl;
		
		const coinDiv=document.createElement('div');
		coinDiv.innerHTML=`
		<span><img src="${imgvalue}" width="20px" alt=""> ${dataJson?.data?.coins[i]?.name}</span>
		<span>${price } ${currency}</span>
		<span>${symbol}</span>
		
		`
		dFrag.appendChild(coinDiv);
		
	}

	
	coinSearch.appendChild(dFrag);
}


function clearsearch(){
	coinsearchlist.innerHTML="";
}


async function getNews(){
	clearNews();
	console.log("inside get news");
	const value=newsbycoinname.value;
	const data = await fetch(`https://newsapi.org/v2/everything?q=${value}&apiKey=261a496f17c840c3808fa96ea8613bec`);
	const dataJson=await data.json();
	console.log(dataJson);

	let common=dataJson?.articles;
	let totalarticles=dataJson?.articles.length;
	const dFrag=document.createDocumentFragment();

	for(let i=10;i<totalarticles;i++){

		const image=await common[i]?.urlToImage;
		const title= await common[i]?.title;
		const content=await common[i]?.content;
		const description=await common[i]?.description;
		const author=await common[i]?.author;
		const date=await common[i]?.publishedAt;

		const url=await common[i]?.url;

		const cardDiv=document.createElement('div');
		cardDiv.innerHTML=`

		<img src="${image}" width="250px" alt="" /> 
        <span> Tilte: ${title}</span>
      	<span> Author: ${author}</span>
        <span>Date: ${date}</span>
        <a href="${url}" target="_blank">Read More</a>
		`


		dFrag.appendChild(cardDiv)

	}

	newSearch.appendChild(dFrag);

	
}

function clearNews(){

	newSearch.innerHTML="";
}



newsBtn.addEventListener('click',(e)=>{
	console.log("evnet fired")
	e.preventDefault();
	getNews();
})


searchBtn.addEventListener('click',(e)=>{
	e.preventDefault();
	findCoins();
})






