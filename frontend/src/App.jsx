import { useState } from "react"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function App() {
  const [topic, setTopic] = useState("")
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState("")
  const [image, setImage] = useState("")

  const generateContent = async () => {
    if (!topic.trim()) return

    try {
      setLoading(true)

      const res = await axios.post(
        `http://127.0.0.1:8000/generate?topic=${encodeURIComponent(topic)}`
      )

      setContent(res.data.content)
      setImage(res.data.image_base64)
    } catch (err) {
      console.error(err)
      alert("Failed to generate content")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">

      <header className="border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <h1 className="text-xl font-black tracking-tight">
            ContentAI
          </h1>

          <Button variant="outline" size="sm">
            Dashboard
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-5">

        <div className="grid gap-5 lg:grid-cols-[340px_1fr]">

          {/* Left Panel */}
          <Card className="h-fit rounded-3xl border shadow-sm">
            <CardContent className="flex flex-col gap-5 p-5">

              <div>
                <div className="mb-3 inline-flex rounded-full border px-3 py-1 text-xs text-muted-foreground">
                  🚀 AI LinkedIn Generator
                </div>

                <h2 className="text-2xl font-black leading-tight tracking-tight">
                  Generate Content & Visuals
                </h2>

                <p className="mt-3 text-xs leading-5 text-muted-foreground">
                  Create LinkedIn posts and matching AI images using Gemini.
                </p>
              </div>

              <Textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Describe your content topic..."
                className="min-h-[180px] resize-none rounded-2xl text-sm"
              />

              <Button
                onClick={generateContent}
                disabled={loading}
                className="h-11 rounded-2xl text-sm font-semibold"
              >
                {loading ? "Generating..." : "Generate"}
              </Button>

            </CardContent>
          </Card>

          {/* Right Panel */}
          <div className="grid gap-5">

            <Card className="rounded-3xl border shadow-sm">
              <CardContent className="p-5">

                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold">
                    Generated Content
                  </h3>

                  {content && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigator.clipboard.writeText(content)}
                    >
                      Copy
                    </Button>
                  )}
                </div>

                {loading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                  </div>
                ) : (
                  <div className="max-h-[260px] overflow-y-auto whitespace-pre-wrap text-sm leading-6">
                    {content || "Generated content will appear here..."}
                  </div>
                )}

              </CardContent>
            </Card>

            <Card className="rounded-3xl border shadow-sm">
              <CardContent className="p-5">

                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold">
                    Generated Image
                  </h3>

                  {image && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const a = document.createElement("a")
                        a.href = `data:image/png;base64,${image}`
                        a.download = "generated-image.png"
                        a.click()
                      }}
                    >
                      Download
                    </Button>
                  )}
                </div>

                {loading ? (
                  <Skeleton className="h-[220px] w-full rounded-2xl" />
                ) : image ? (
                  <img
                    src={`data:image/png;base64,${image}`}
                    alt="Generated"
                    className="h-[220px] w-full rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-[220px] items-center justify-center rounded-2xl border border-dashed text-sm text-muted-foreground">
                    Generated image will appear here
                  </div>
                )}

              </CardContent>
            </Card>

          </div>

        </div>

      </main>

    </div>
  )
}

export default App