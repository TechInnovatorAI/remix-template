import { LoaderFunctionArgs } from '@remix-run/node';

import * as ReturnPage from '../home.$account.billing.return._index/route';

export const meta = ReturnPage.meta;

export const loader = (args: LoaderFunctionArgs) => {
  return ReturnPage.loader(args);
};

const Page = ReturnPage.default;

export default Page;
