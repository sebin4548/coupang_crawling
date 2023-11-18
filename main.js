async function show_review(page) {
  await page.waitForTimeout(2000);
  await page.evaluate(() => {
    // 페이지의 맨 아래로 스크롤
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  });

  // 1초 대기
  await page.waitForTimeout(2000);
  // 페이지의 맨 위로 스크롤
  // await page.evaluate(() => {

  //   window.scrollTo({
  //     top: 0,
  //     behavior: 'auto'
  //   });
  // });
}

async function waitForSeconds(time) {
  console.log('실행중');
  await new Promise(resolve => setTimeout(resolve, time));
}

async function getMemberIds(page) {
  return await page.evaluate(() => {
    const elements = document.querySelectorAll('.sdp-review__article__list__info__user__name.js_reviewUserProfileImage');
    return Array.from(elements).map(element => element.getAttribute('data-member-id'));
  });
}

async function count_scroll(page) {
  return await page.evaluate(async () => {
    // const totalCountElement = document.querySelector('span.js_reviewProfileModalListTotalCount');
    // console.log(totalCountElement);
    // const totalCountText = totalCountElement.textContent;
    // const totalCount = parseInt(totalCountText.replace(/,/g, ''), 10);
    //console.log(totalCount);
    const result = 20;
    return result;  
  });
}

async function scroll(page, count_page) {
  return await page.evaluate(async (count) => {
    const elementToScroll = document.querySelector('.review__modal-groups.js_reviewModalGroup.review-modal-group-active');
    if (elementToScroll) {
      for (let i = 0; i < count; i++) {
        elementToScroll.scrollTop = elementToScroll.scrollHeight;
        await new Promise(resolve => setTimeout(resolve, 200)); // 0.5초 지연
      }
    }
  }, count_page);
}

async function data(page,id_get){
  return await page.evaluate((id) => {
    const productNames = document.querySelectorAll('.sdp-review__profile__article__list__reviews__product__name');
    const starDates = document.querySelectorAll('.sdp-review__profile__article__list__reviews__star__date');
    const sellerNames = document.querySelectorAll('.sdp-review__profile__article__list__reviews__seller_name');
    const reviewContentElement = document.querySelectorAll('.sdp-review__profile__article__list__reviews__content');

    const id_list = [];
    
    id_list.push(id);
    
    productNames.forEach((element, index) => {
      const item = [];
      const productName = element.textContent.trim();
      const starDate = starDates[index].textContent.trim();
      const sellerName = sellerNames[index].textContent.trim();
      //const hasContent = contentExistence[index] ? 1 : 0;
      // 텍스트 내용 가져오기
      const textContent = reviewContentElement[index].textContent;

      // HTML 태그 및 공백 제외한 글자 수 계산
      const characterCount = textContent.length;
      
      item.push(productName);
      item.push(starDate);
      item.push(sellerName);
      //item.push(hasContent);
      item.push(characterCount);
      id_list.push(item);
    });
    return id_list;
  },id_get);
}


async function test(page,id ){
  await page.evaluate(async (id) => {
    const elements = await document.querySelectorAll('.sdp-review__article__list__info__user__name.js_reviewUserProfileImage');
    elements[0].setAttribute('data-member-id', id);
    await elements[0].click();
    await new Promise(resolve => setTimeout(resolve, 1000));
  },id);
  const count_page = await count_scroll(page);
  await scroll(page,count_page);
  human_list= await data(page,id);
  return human_list;
}



///////////////////////////////////////////////////////

//푸피터 열기
const puppeteer = require('puppeteer');

//푸피터 실행
async function final(id) {
  const browser = await puppeteer.launch({
    headless: false
    ,args: ['--blink-settings=imagesEnabled=false'] // 이미지 로딩 비활성화
  });
  // 페이지 열기
  const page = await browser.newPage();
  await page.goto('https://www.coupang.com/vp/products/7345174742?itemId=18888453974&vendorItemId=86016622490&sourceType=cmgoms&omsPageId=103048&omsPageUrl=103048&isAddedCart=');
  
  // 리뷰 소환
  await show_review(page);
  // 크롤링 진행
  const human_list= await test(page,id);

  //결과 테스트
  //await console.log("human_list:",human_list);  
  
  // 브라우저 닫기
  //await browser.close();
  return human_list;
}

// 함수 호출
async function main(id_get) {
  page_db = [];

  const promises = id_get.map(id => final(id));

  try {
    const results = await Promise.all(promises);
    page_db.push(...results);
    console.log(page_db);
    //return page_db;
  } catch (error) {
    console.error('하나 이상의 Promise에서 에러 발생:', error);
  }
}

//////////////////////////////////////////////test

// async function main(id_get) {
//   final(id_get);
// }

id_five= ['11330282', '3419688', '13538132', '3156260', '123366059'];
id_two= ['11330282', '3419688'];
// result =main(id_five[0]);

//////////////////////////////////////////////test

result =main(id_five);
//console.log(result);  