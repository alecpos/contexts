export const NextResponse = {
  json: (body: any, init?: any) => new Response(JSON.stringify(body), { status: init?.status ?? 200 })
}
export const NextRequest = function(){}
