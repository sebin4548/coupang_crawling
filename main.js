async function show_review(page) {
  await page.waitForTimeout(3000);
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
  await page.evaluate(() => {

    window.scrollTo({
      top: 0,
      behavior: 'auto'
    });
  });
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
    const totalCountElement = document.querySelector('span.js_reviewProfileModalListTotalCount');
    const totalCountText = totalCountElement.textContent;
    const totalCount = parseInt(totalCountText.replace(/,/g, ''), 10);
    const result = Math.ceil(totalCount / 15);
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
    const contentExistence = document.querySelectorAll('.sdp-review__profile__article__list__reviews__title');
    
    const id_list = [];
    
    id_list.push(id);
    
    productNames.forEach((element, index) => {
      const item = [];
      const productName = element.textContent.trim();
      const starDate = starDates[index].textContent.trim();
      const sellerName = sellerNames[index].textContent.trim();
      //const hasContent = contentExistence[index] ? 1 : 0;
      const commentLength = contentExistence[index] ? contentExistence[index].textContent.length : 0;
      item.push(productName);
      item.push(starDate);
      item.push(sellerName);
      //item.push(hasContent);
      item.push(commentLength);
      id_list.push(item);
    });
    return id_list;
  },id_get);
}


async function test(page,i, id_list ){
  await page.evaluate(async (i, id_list ) => {
    const elements = await document.querySelectorAll('.sdp-review__article__list__info__user__name.js_reviewUserProfileImage');
    await elements[i].click();
    await new Promise(resolve => setTimeout(resolve, 300));
  },i, id_list);
  const count_page = await count_scroll(page);
  await new Promise(resolve => setTimeout(resolve, 300));
  await scroll(page,count_page);
  human_list= await data(page,id_list[i]);
  return human_list;
}



///////////////////////////////////////////////////////

//푸피터 열기
const puppeteer = require('puppeteer');

//푸피터 열기
async function final() {
  const browser = await puppeteer.launch({
    headless: false
    ,args: ['--blink-settings=imagesEnabled=false'] // 이미지 로딩 비활성화
  });
  // 페이지 열기
  const page = await browser.newPage();
  await page.goto('https://www.coupang.com/vp/products/7345174742?itemId=18888453974&vendorItemId=86016622490&sourceType=cmgoms&omsPageId=103048&omsPageUrl=103048&isAddedCart=');
  //결과 미리 선언
  page_db=[];
  // 리뷰 소환
  await show_review(page);
  // 아이디 리스트 생성
  const id_list = await getMemberIds(page);


  const human_list= await test(page,0,id_list);

  //결과 테스트
  await console.log('Member IDs:', id_list);
  await console.log("human_list:",human_list);

  
  
  // 브라우저 닫기
  //await browser.close();
}

// 함수 호출
final();

