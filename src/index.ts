import { Octokit } from '@octokit/rest'
import { Config } from './config'
import cliProgress from 'cli-progress'
import { wait, hasNext } from './util'

interface IEnvironment {
	id: number
	name: string
}

const config = new Config()
const octokit = new Octokit({
	auth: config.token
})

async function clean(environments: IEnvironment[]) {
	environments.forEach(async (environment) => {
		await octokit.repos.deleteAnEnvironment({
			owner: config.owner,
			repo: config.repo,
			environment_name: environment.name
		})

		await wait(5000)
	})
}

export async function audit() {
	if (!config.environmentPrefix) {
		console.log('Environment prefix is not set. Please set it in .env file.')
		return
	}

    const args = process.argv.slice(2)
    if (args.length > 0 && args[0] != 'clean') {
        console.log(`Unknown argument ${args[0]}`)
        return
    }

	const props = {
		owner: config.owner,
		repo: config.repo,
		per_page: 30,
		page: 1
	}

	let response = await octokit.repos.getAllEnvironments(props)

	const totalCount = response.data.total_count || 0

	console.log(
		`Auditing environments in repository ${config.owner}/${config.repo}`
	)

	const progressBar = new cliProgress.SingleBar(
		{},
		cliProgress.Presets.shades_classic
	)

	progressBar.start(Math.ceil(totalCount / props.per_page), 1)

	const environments: IEnvironment[] = []
	while (hasNext(response)) {
		progressBar.update(props.page)

		response.data.environments
			?.filter((environment) =>
				environment.name.startsWith(config.environmentPrefix)
			)
			.map((environment: IEnvironment) => {
				const e: IEnvironment = {
					id: environment.id,
					name: environment.name
				}

				environments.push(e)
			})

		response = await octokit.repos.getAllEnvironments(props)
		props.page++
	}

	progressBar.stop()

	console.log(
		`There are ${environments.length} environments starting with '${config.environmentPrefix}'`
	)

    if (args.length > 0 && args[0] === 'clean') {
		console.log(`Removing environments..`)
		await clean(environments)
    }

}

audit()
