import React from 'react'
import { useLocation } from 'react-router'
import { Menu as UikitMenu } from '@pancakeswap/uikit'
import { languageList } from 'config/localization/languages'
import { useTranslation } from 'contexts/Localization'
import PhishingWarningBanner from 'components/PhishingWarningBanner'
import useTheme from 'hooks/useTheme'
import { usePriceCakeBusd, useLpTokenPrice, useFarms } from 'state/farms/hooks'
import { usePools} from 'state/pools/hooks'
import { usePhishingBannerManager } from 'state/user/hooks'
import BigNumber from 'bignumber.js'
import Balance from 'components/Balance'
import { getBalanceNumber } from 'utils/formatBalance'
import config from './config/config'
import UserMenu from './UserMenu'
import GlobalSettings from './GlobalSettings'
import { getActiveMenuItem, getActiveSubMenuItem } from './utils'

const totalStakedPoolAmount = (pools) => {

  let totalValue = 0
  const tvl = [
    {
      label : "Total Value Locked",
      items : [
        {
          label : ""
        }
      ]
    }
  ];

  pools.forEach(pool => {
    const { sousId, stakingToken, totalStaked, isAutoVault, earningTokenPrice } = pool
    totalValue += getBalanceNumber(totalStaked, stakingToken.decimals) * earningTokenPrice
  });

  if (Number.isNaN(totalValue))
    totalValue = 0

  tvl[0].items[0].label = "$".concat(totalValue.toFixed(8).toString())
  return tvl
}

const totalStakedFarmsAmount = (farms, lpPrice) => {

  let totalValue = 0
  const tvl = [
    {
      label : "Total Value Locked",
      items : [
        {
          label : ""
        }
      ]
    }
  ];

  
  farms.forEach(farm => {
    const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(lpPrice)
    if (totalLiquidity)
      totalValue += totalLiquidity.toNumber()
  });

  if (Number.isNaN(totalValue))
    totalValue = 0
  tvl[0].items[0].label = "$".concat(totalValue.toFixed(8).toString())
  return tvl
}

const Menu = (props) => {
  const { isDark, toggleTheme } = useTheme()
  const cakePriceUsd = usePriceCakeBusd()
  const lpPrice = useLpTokenPrice("PET-BNB LP")
  const { currentLanguage, setLanguage, t } = useTranslation()
  const { pathname } = useLocation()
  const [showPhishingWarningBanner] = usePhishingBannerManager()
  const {pools} = usePools()
  const {data:farmsLP} = useFarms()


  const activeMenuItem = getActiveMenuItem({ menuConfig: config(t), pathname })
  // const activeSubMenuItem = getActiveSubMenuItem({ menuItem: activeMenuItem, pathname })

  const footerLinkValue = (!activeMenuItem || activeMenuItem.label.startsWith("Farms")) ? totalStakedFarmsAmount(farmsLP, lpPrice) : totalStakedPoolAmount(pools)
  
  return (
    <UikitMenu
      userMenu={<UserMenu />}
      globalMenu={<GlobalSettings />}
      banner={false && <PhishingWarningBanner />}
      isDark={isDark}
      toggleTheme={toggleTheme}
      currentLang={currentLanguage.code}
      langs={languageList}
      setLang={setLanguage}
      cakePriceUsd={cakePriceUsd.toNumber()}
      links={config(t)}
      subLinks={activeMenuItem?.hideSubNav ? [] : activeMenuItem?.items}
      footerLinks={footerLinkValue}
      activeItem={activeMenuItem?.href}
      // activeSubItem={activeSubMenuItem?.href}
      buyCakeLabel={t('Buy PET')}
      {...props}
    />
  )
}

export default Menu
