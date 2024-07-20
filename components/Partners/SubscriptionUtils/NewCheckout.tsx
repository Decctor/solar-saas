import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { copyToClipboard } from '@/lib/hooks'
import { formatLongString } from '@/utils/methods'
import { useMutationWithFeedback } from '@/utils/mutations/general-hook'
import { useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import React, { useState } from 'react'
import { FaMinus, FaPlus, FaRegCopy } from 'react-icons/fa'

type NewCheckoutProps = {
  partnerId: string
}
function NewCheckout({ partnerId }: NewCheckoutProps) {
  const queryClient = useQueryClient()
  const [usersQtyHolder, setUsersQtyHolder] = useState<number>(1)

  async function generateCheckoutUrl(usersQty: number) {
    try {
      const { data } = await axios.post('/api/integration/stripe/checkout', { usersQty, partnerId })
      const url = data.data

      copyToClipboard(url)
      return url
    } catch (error) {
      throw error
    }
  }
  const {
    data,
    mutate: handleGenerateCheckoutUrl,
    isPending,
  } = useMutationWithFeedback({
    mutationKey: ['create-checkout-session'],
    mutationFn: generateCheckoutUrl,
    queryClient,
    affectedQueryKey: [],
  })
  return (
    <Dialog>
      <DialogTrigger>
        <button className="whitespace-nowrap rounded bg-blue-800 px-4 py-1 text-sm font-medium text-white shadow disabled:bg-gray-500 disabled:text-white enabled:hover:bg-blue-700 enabled:hover:text-white">
          CRIAR CHECKOUT
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>NOVO CHECKOUT</DialogTitle>
          <DialogDescription>
            Escolha o número de usuários a serem criados e clica em <strong className="text-blue-500">gerar checkout.</strong>
          </DialogDescription>
        </DialogHeader>
        {data ? (
          <div className="flex w-full items-center justify-center gap-1 rounded border border-blue-700 bg-blue-50 p-3 text-center text-xs text-blue-700">
            <h1 className="break-all">{formatLongString(data as string, 100)}</h1>
            <button onClick={() => copyToClipboard(data as string)} className="min-w-fit">
              <FaRegCopy size={20} />
            </button>
          </div>
        ) : (
          <>
            <div className="flex w-full grow flex-col">
              <div className="flex w-full items-center justify-between gap-4 self-center">
                <button
                  onClick={() => setUsersQtyHolder((prev) => (prev - 1 <= 0 ? prev : prev - 1))}
                  className="flex items-center justify-center rounded-full border border-gray-500 bg-[#fff] p-3 text-xs duration-300 ease-in-out hover:scale-105 hover:bg-gray-100 lg:text-lg"
                >
                  <FaMinus />
                </button>
                <h1 className="text-3xl font-black lg:text-4xl ">{usersQtyHolder}</h1>
                <button
                  onClick={() => setUsersQtyHolder((prev) => prev + 5)}
                  className="flex items-center justify-center rounded-full border border-gray-500 bg-[#fff] p-3 text-xs duration-300 ease-in-out hover:scale-105 hover:bg-gray-100 lg:text-lg"
                >
                  <FaPlus />
                </button>
              </div>
              <div className="flex w-full items-center justify-between gap-3">
                <button
                  onClick={() => setUsersQtyHolder(5)}
                  className="min-w-1/5 flex w-[40%] items-center justify-center rounded-md border border-gray-500 bg-white p-1 py-2 text-xs font-bold duration-300 ease-in-out hover:scale-105 hover:bg-gray-100 lg:w-1/4 lg:p-2 lg:py-3 lg:text-lg"
                >
                  5
                </button>
                <button
                  onClick={() => setUsersQtyHolder(10)}
                  className="min-w-1/5 flex w-[40%] items-center justify-center rounded-md border border-gray-500 bg-white p-1 py-2 text-xs font-bold duration-300 ease-in-out hover:scale-105 hover:bg-gray-100 lg:w-1/4 lg:p-2 lg:py-3 lg:text-lg"
                >
                  10
                </button>
                <button
                  onClick={() => setUsersQtyHolder(25)}
                  className="min-w-1/5 flex w-[40%] items-center justify-center rounded-md border border-gray-500 bg-white p-1 py-2 text-xs font-bold duration-300 ease-in-out hover:scale-105 hover:bg-gray-100 lg:w-1/4 lg:p-2 lg:py-3 lg:text-lg"
                >
                  25
                </button>
                <button
                  onClick={() => setUsersQtyHolder(50)}
                  className="min-w-1/5 flex w-[40%] items-center justify-center rounded-md border border-gray-500 bg-white p-1 py-2 text-xs font-bold duration-300 ease-in-out hover:scale-105 hover:bg-gray-100 lg:w-1/4 lg:p-2 lg:py-3 lg:text-lg"
                >
                  50
                </button>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={() => {
                  // @ts-ignore
                  handleGenerateCheckoutUrl(usersQtyHolder)
                }}
              >
                CRIAR CHECKOUT
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default NewCheckout
