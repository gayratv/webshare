import { Locator, Page } from 'playwright';

export async function checkLocatorExist(baseLocator: Locator | Page, locatorSelector: string): Promise<Locator | null> {
  const tempLoc = baseLocator.locator(locatorSelector);
  const tempCnt = await tempLoc.count();

  // const tempName = 'error ' + tempCnt;
  if (tempCnt === 1) {
    return tempLoc;
  } else return null;
}

export async function getLocatorAttribute(
  baseLocator: Locator | Page,
  locatorSelector: string,
  attrName: string,
): Promise<string | null> {
  const loc = await checkLocatorExist(baseLocator, locatorSelector);
  if (loc) {
    return await loc.getAttribute(attrName);
  } else return null;
}
export async function getLocatorText(baseLocator: Locator | Page, locatorSelector: string): Promise<string | null> {
  const loc = await checkLocatorExist(baseLocator, locatorSelector);
  if (loc) {
    return await loc.innerText();
  } else return null;
}

export async function checkLocatorExistCount(baseLocator: Locator | Page, locatorSelector: string): Promise<number> {
  return await baseLocator.locator(locatorSelector).count();
}

export async function checkLocatorAttribute(baseLocator: Locator, locatorSelector: string, attrName: string) {
  const tempLoc = baseLocator.locator(locatorSelector);
  const tempCnt = await tempLoc.count();

  let tempName = 'error ' + tempCnt;
  if (tempCnt === 1) {
    tempName = (await tempLoc.getAttribute(attrName)) || 'unknown error';
  }
  return tempName;
}

export async function checkLocatorAttribute2(baseLocator: Locator, locatorSelector: string, attrName: string) {
  const tempLoc = baseLocator.filter({ has: baseLocator.locator(locatorSelector) });
  const tempCnt = await tempLoc.count();

  let tempName = 'error ' + tempCnt;
  if (tempCnt === 1) {
    tempName = (await tempLoc.getAttribute(attrName)) || 'unknown error';
  }
  return tempName;
}

export async function checkPageAttribute(page: Page, locatorSelector: string, attrName: string) {
  const tempLoc = page.locator(locatorSelector);
  const tempCnt = await tempLoc.count();

  let tempName = 'error ' + tempCnt;
  if (tempCnt === 1) {
    tempName = (await tempLoc.getAttribute(attrName)) || tempName + ' err getAttribute';
  }
  return tempName;
}

export async function checkPageAttribute2(page: Page, locatorSelector: string, attrName: string) {
  const tempLoc = page.locator(locatorSelector);
  const tempCnt = await tempLoc.count();

  let tempName = 'error ' + tempCnt;
  if (tempCnt === 0) {
    return tempName;
  }

  tempName = '';
  console.log('cnt ', attrName, tempCnt);
  for (let index = 0; index < tempCnt; index++) {
    const element = await tempLoc.nth(index);
    console.log((await element.getAttribute(attrName)) || ' null ');
    // tempName = +'\n' + ((await element.getAttribute(attrName)) || ' null ');
  }

  return tempName;
}
