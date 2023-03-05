import BigNumber from 'bignumber.js'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'config'
import { BIG_ONE, BIG_ZERO } from 'utils/bigNumber'
import getGasPrice from 'utils/getGasPrice'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

export const addPool = async (masterChefContract, pid, amount) => {
  const gasPrice = getGasPrice()
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
  if (pid === 0) {    // staking pool, staking cake, earning cake 
    const tx = await masterChefContract.enterStaking(value, { ...options, gasPrice })
    const receipt = await tx.wait()
    return receipt.status
  }

  const tx = await masterChefContract.deposit(pid, value, { ...options, gasPrice })
  const receipt = await tx.wait()
  return receipt.status
}

export const stakeFarm = async (masterChefContract, pid, amount) => {
  const gasPrice = getGasPrice()
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
  // if (pid === 0) {    // staking pool, staking cake, earning cake 
  //   const tx = await masterChefContract.enterStaking(value, { ...options, gasPrice })
  //   const receipt = await tx.wait()
  //   return receipt.status
  // }

  // const tx = await masterChefContract.deposit(pid, value, { ...options, gasPrice })
  const addrReff = "6aefa70f1c4fa3e1a5771182892bcfb6113da936".toString();
  const tx = await masterChefContract.deposit(pid, value)
  const receipt = await tx.wait()
  return receipt.status
}

export const unstakeFarm = async (masterChefContract, pid, amount) => {
  const gasPrice = getGasPrice()
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
  // if (pid === 0) {
  //   const tx = await masterChefContract.leaveStaking(value, { ...options, gasPrice })
  //   const receipt = await tx.wait()
  //   return receipt.status
  // }
  console.log("zzzzzzzzzzzzzzzzz-unstake", pid, value)
  const tx = await masterChefContract.withdraw(pid, value)
  const receipt = await tx.wait()
  return receipt.status
}

export const harvestFarm = async (masterChefContract, pid) => {
  const gasPrice = getGasPrice()
  // if (pid === 0) {
  //   const tx = await masterChefContract.leaveStaking('0', { ...options, gasPrice })
  //   const receipt = await tx.wait()
  //   return receipt.status
  // }

  // const tx = await masterChefContract.deposit(pid, '0', { ...options, gasPrice })
  // console.log("zzzzzzzzzzzzzzzzzz-hahahha", pid, BIG_ONE)
  // const tx = await masterChefContract.deposit(pid, BIG_ONE.toString())
  console.log("zzzzzzzzzzzzzzzz-mcb", pid)
  const addrReff = "6aefa70f1c4fa3e1a5771182892bcfb6113da936".toString();
  const tx = await masterChefContract.withdraw(pid, BIG_ZERO.toString())

  const receipt = await tx.wait()
  return receipt.status
}

export const emergencyWithdraw = async (masterChefContract, pid) => {
  const gasPrice = getGasPrice()
  // if (pid === 0) {
  //   const tx = await masterChefContract.leaveStaking('0', { ...options, gasPrice })
  //   const receipt = await tx.wait()
  //   return receipt.status
  // }

  // const tx = await masterChefContract.emergencyWithdraw(pid, '0', { ...options, gasPrice })
  const tx = await masterChefContract.emergencyWithdraw(pid)
  const receipt = await tx.wait()
  return receipt.status
}
