import { Authors, allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'About' })

function getThursdays(year: number) {
  const result = [] as { month: number; day: number[] }[]

  for (let month = 0; month < 12; month++) {
    let count = 0
    const days: number[] = []
    for (let day = 1; day <= 31; day++) {
      const date = new Date(year, month, day)
      if (date.getMonth() !== month) break // Exceeded last day of the month
      if (date.getDay() === 4) {
        // 4 stands for Thursday
        count++
        if (count === 2 || count === 4) {
          days.push(day)
        }
      }
    }
    if (days.length > 0) {
      result.push({ month: month, day: days })
    }
  }

  return result
}

export default function Page() {
  const author = allAuthors.find((p) => p.slug === 'default') as Authors
  const mainContent = coreContent(author)
  const thursdays = getThursdays(new Date().getFullYear())

  return (
    <>
      <AuthorLayout content={mainContent}>
        <h2>About Me:</h2>
        <MDXLayoutRenderer code={author.body.code} />
        <h3>Expected Dates:</h3>
        <div id="dates" className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
          {thursdays.map((thursday, i) => {
            return (
              <div
                key={i}
                className="space-2 flex flex-col items-center justify-center rounded-2xl bg-blue-100 p-4 dark:bg-blue-800"
              >
                <div className="mx-3 text-2xl font-bold">
                  {new Date(2024, thursday.month, 1).toLocaleDateString('en-US', {
                    month: 'short',
                  })}
                </div>
                <div className="flex gap-2">
                  <div className="text-lg font-bold">{thursday.day[0]}</div>
                  &amp;
                  <div className="text-lg font-bold">{thursday.day[1]}</div>
                </div>
              </div>
            )
          })}
        </div>
        <p>
          <a href="mailto:hello@aguynamedandre.com">Like to join? Email me!</a>
        </p>
      </AuthorLayout>
    </>
  )
}
