import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'PET-SWAP',
  description:
    'The most popular AMM on BSC by user count! Earn CAKE through yield farming or win it in the Lottery, then stake it in Syrup Pools to earn more tokens! Initial Farm Offerings (new token launch model pioneered by PET Rewards), NFTs, and more, on a platform you can trust.',
  image: 'https://pancakeswap.finance/images/hero.png',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  let basePath
  if (path.startsWith('/swap')) {
    basePath = '/swap'
  } else if (path.startsWith('/add')) {
    basePath = '/add'
  } else if (path.startsWith('/remove')) {
    basePath = '/remove'
  } else if (path.startsWith('/teams')) {
    basePath = '/teams'
  } else if (path.startsWith('/voting/proposal') && path !== '/voting/proposal/create') {
    basePath = '/voting/proposal'
  } else if (path.startsWith('/nfts/collections')) {
    basePath = '/nfts/collections'
  } else if (path.startsWith('/nfts/profile')) {
    basePath = '/nfts/profile'
  } else if (path.startsWith('/pancake-squad')) {
    basePath = '/pancake-squad'
  } else {
    basePath = path
  }

  switch (basePath) {
    case '/':
      return {
        title: `${t('Home')} | ${t('PET Rewards')}`,
      }
    case '/swap':
      return {
        title: `${t('Exchange')} | ${t('PET Rewards')}`,
      }
    case '/add':
      return {
        title: `${t('Add Liquidity')} | ${t('PET Rewards')}`,
      }
    case '/remove':
      return {
        title: `${t('Remove Liquidity')} | ${t('PET Rewards')}`,
      }
    case '/liquidity':
      return {
        title: `${t('Liquidity')} | ${t('PET Rewards')}`,
      }
    case '/find':
      return {
        title: `${t('Import Pool')} | ${t('PET Rewards')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('PET Rewards')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('PET Rewards')}`,
      }
    case '/prediction/leaderboard':
      return {
        title: `${t('Leaderboard')} | ${t('PET Rewards')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('PET-SWAP')}`,
      }
    case '/farms/auction':
      return {
        title: `${t('Farm Auctions')} | ${t('PET Rewards')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('PET-SWAP')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('PET Rewards')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('PET Rewards')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('PET Rewards')}`,
      }
    case '/voting':
      return {
        title: `${t('Voting')} | ${t('PET Rewards')}`,
      }
    case '/voting/proposal':
      return {
        title: `${t('Proposals')} | ${t('PET Rewards')}`,
      }
    case '/voting/proposal/create':
      return {
        title: `${t('Make a Proposal')} | ${t('PET Rewards')}`,
      }
    case '/info':
      return {
        title: `${t('Overview')} | ${t('PET Rewards Info & Analytics')}`,
        description: 'View statistics for PET Rewards exchanges.',
      }
    case '/info/pools':
      return {
        title: `${t('Pools')} | ${t('PET Rewards Info & Analytics')}`,
        description: 'View statistics for PET Rewards exchanges.',
      }
    case '/info/tokens':
      return {
        title: `${t('Tokens')} | ${t('PET Rewards Info & Analytics')}`,
        description: 'View statistics for PET Rewards exchanges.',
      }
    case '/nfts':
      return {
        title: `${t('Overview')} | ${t('PET Rewards')}`,
      }
    case '/nfts/collections':
      return {
        title: `${t('Collections')} | ${t('PET Rewards')}`,
      }
    case '/nfts/profile':
      return {
        title: `${t('Your Profile')} | ${t('PET Rewards')}`,
      }
    case '/pancake-squad':
      return {
        title: `${t('Pancake Squad')} | ${t('PET Rewards')}`,
      }
    default:
      return null
  }
}
