  await page.goto("https://www.coupang.com/np/search?component=&q=" + searchTxt + "&channel=user");

//   //test for 이름 찾기
//   const firstMatch = await page.$eval('#contents > div > div.prod-atf-main > div.prod-buy.new-oos-style.not-loyalty-member.eligible-address.without-subscribe-buy-type.DISPLAY_0 > div.prod-buy-header > h2', (elem) => {
//     return elem.innerText;
//   });
//   console.log("dddd",{ firstMatch });