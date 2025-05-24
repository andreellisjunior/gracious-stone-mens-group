'use client'

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'

export default function AlertModal() {
  const [open, setOpen] = useState(true)

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in fixed inset-0 bg-black/25 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in data-closed:sm:translate-y-0 data-closed:sm:scale-95 relative transform overflow-hidden rounded-lg border-[1px] border-white/25 bg-white/75 p-6 text-left shadow-2xl backdrop-blur-md transition-all dark:bg-gray-900/25 sm:my-8 sm:w-full sm:max-w-lg"
          >
            <div className="bg-transparent sm:p-6 sm:pb-4">
              <div className="flex-col items-center justify-center gap-2 sm:flex">
                <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-500 sm:mx-0 sm:size-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                    />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0">
                  <DialogTitle as="h3" className="text-base font-semibold ">
                    IMPORTANT!
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm">
                      The men's group will be meeting at a new address. Our next meeting will be on
                      June 26th. Please make note of this change and update your calendar
                      accordingly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-transparent px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="shadow-xs inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 sm:ml-3 sm:w-auto"
              >
                Got It!
              </button>
              <a
                href="mailto:hello@aguynamedandre.com?subject=Request New Address"
                className="shadow-xs mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Get New Address
              </a>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
