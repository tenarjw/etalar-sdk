import { NextRouter } from 'next/router';
import { NavGroup, NavLink } from 'src/@core/layouts/types'

/**
 * Sprawdza, czy element nawigacji lub jego dzieci są aktywne.
 */
export const hasActiveChild = (item: NavGroup, currentURL: string): boolean => {
  const { children } = item;

  if (!children) {
    return false;
  }

  for (const child of children) {
    if ((child as NavGroup).children) {
      if (hasActiveChild(child as NavGroup, currentURL)) {
        return true;
      }
    }
    const childPath = (child as NavLink).path;

    if (
      child &&
      childPath &&
      currentURL &&
      (childPath === currentURL || (currentURL.includes(childPath) && childPath !== '/'))
    ) {
      return true;
    }
  }

  return false;
};

/**
 * Obsługuje zapytania URL
 */
export const handleURLQueries = (router: NextRouter, path: string | undefined): boolean => {
  if (Object.keys(router.query).length && path) {
    const arr = Object.keys(router.query);
    return router.asPath.includes(path) && router.asPath.includes(router.query[arr[0]] as string) && path !== '/';
  }
  return false;
};