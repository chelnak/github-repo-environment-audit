import { OctokitResponse } from "@octokit/types"
import parseLinkHeader, { Links } from "parse-link-header"


export function hasNext(response: OctokitResponse<unknown>): boolean {
	const links: Links | null = parseLinkHeader(response.headers.link)
	return links && links.next && links.next.url ? true : false
}

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))