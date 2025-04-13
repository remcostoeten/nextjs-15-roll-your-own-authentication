import { DashboardLayout } from '@/components/dashboard/v2/dashboard-shell'
import SearchExample from '@/src/modules/search/example-usage'

export default function Home() {
	return (
		<DashboardLayout>
			<div className="p-6">
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-2xl font-bold text-white">Dashboard</h1>
					<div className="flex items-center gap-2">
						<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-500">
							<span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
							Security Issues
						</span>
						<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-500">
							<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
							Project Status
						</span>
					</div>
				</div>

				<div className="mb-8">
					<h2 className="text-lg font-medium text-white mb-2">
						Welcome to your new project
					</h2>
					<p className="text-gray-400">
						Your project has been deployed on its own instance, with
						its own API all set up and ready to use.
					</p>
				</div>

				<div className="mb-8">
					<h2 className="text-lg font-medium text-white mb-2">
						Get started by building out your database
					</h2>
					<p className="text-gray-400 mb-4">
						Start building your app by creating tables and inserting
						data. Our Table Editor makes Postgres as easy to use as
						a spreadsheet, but there's also our SQL Editor if you
						need something more.
					</p>

					<div className="flex gap-2">
						<button className="inline-flex items-center px-3 py-2 bg-[#2E2E2E] hover:bg-[#3E3E3E] rounded-md text-sm text-white">
							<svg
								className="mr-2 h-4 w-4"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<rect
									x="3"
									y="3"
									width="18"
									height="18"
									rx="2"
									stroke="currentColor"
									strokeWidth="2"
								></rect>
								<path
									d="M3 9H21"
									stroke="currentColor"
									strokeWidth="2"
								></path>
								<path
									d="M9 21L9 9"
									stroke="currentColor"
									strokeWidth="2"
								></path>
							</svg>
							Table Editor
						</button>
						<button className="inline-flex items-center px-3 py-2 bg-[#2E2E2E] hover:bg-[#3E3E3E] rounded-md text-sm text-white">
							<svg
								className="mr-2 h-4 w-4"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M7.89844 8.4342L11.5004 12.0356L7.89844 15.6375M12 15.3292H16.5M5 21.1055H19C20.1046 21.1055 21 20.21 21 19.1055V5.10547C21 4.0009 20.1046 3.10547 19 3.10547H5C3.89543 3.10547 3 4.0009 3 5.10547V19.1055C3 20.21 3.89543 21.1055 5 21.1055Z"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								></path>
							</svg>
							SQL Editor
						</button>
						<button className="inline-flex items-center px-3 py-2 bg-[#2E2E2E] hover:bg-[#3E3E3E] rounded-md text-sm text-white">
							About Database
						</button>
					</div>
				</div>

				<div className="mb-8">
					<h2 className="text-lg font-medium text-white mb-2">
						Explore our other products
					</h2>
					<p className="text-gray-400 mb-4">
						Supabase provides all the backend features you need to
						build a product. You can use it completely, or just the
						features you need.
					</p>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<SearchExample />
						<div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-md p-4">
							<div className="flex items-center mb-4">
								<div className="bg-[#2E2E2E] p-2 rounded-md">
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M5.24121 15.0674H12.7412M5.24121 15.0674V18.0674H12.7412V15.0674M5.24121 15.0674V12.0674H12.7412V15.0674M15 7.60547V4.60547C15 2.94861 13.6569 1.60547 12 1.60547C10.3431 1.60547 9 2.94861 9 4.60547V7.60547M5.20898 9.60547L5.20898 19.1055C5.20898 20.21 6.10441 21.1055 7.20898 21.1055H16.709C17.8136 21.1055 18.709 20.21 18.709 19.1055V9.60547C18.709 8.5009 17.8136 7.60547 16.709 7.60547L7.20899 7.60547C6.10442 7.60547 5.20898 8.5009 5.20898 9.60547Z"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
										></path>
									</svg>
								</div>
							</div>
							<h3 className="text-white font-medium mb-1">
								Authentication
							</h3>
							<p className="text-gray-400 text-sm mb-4">
								A complete user management system that works
								without any additional tools.
							</p>
							<div className="flex gap-2">
								<button className="text-xs text-white bg-[#2E2E2E] hover:bg-[#3E3E3E] px-2 py-1 rounded">
									Explore Auth
								</button>
								<button className="text-xs text-white bg-[#2E2E2E] hover:bg-[#3E3E3E] px-2 py-1 rounded">
									About Auth
								</button>
							</div>
						</div>

						<div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-md p-4">
							<div className="flex items-center mb-4">
								<div className="bg-[#2E2E2E] p-2 rounded-md">
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M3 19L3 5C3 3.89543 3.89543 3 5 3L19 3C20.1046 3 21 3.89543 21 5L21 19C21 20.1046 20.1046 21 19 21L5 21C3.89543 21 3 20.1046 3 19Z"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
										></path>
										<path
											d="M8.5 8.5L8.5 15.5"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
										></path>
										<path
											d="M15.5 8.5L15.5 15.5"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
										></path>
										<path
											d="M12 8.5L12 15.5"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
										></path>
									</svg>
								</div>
							</div>
							<h3 className="text-white font-medium mb-1">
								Storage
							</h3>
							<p className="text-gray-400 text-sm mb-4">
								Store, organize, and serve any file types of any
								size from multiple buckets.
							</p>
							<div className="flex gap-2">
								<button className="text-xs text-white bg-[#2E2E2E] hover:bg-[#3E3E3E] px-2 py-1 rounded">
									Explore Storage
								</button>
								<button className="text-xs text-white bg-[#2E2E2E] hover:bg-[#3E3E3E] px-2 py-1 rounded">
									About Storage
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</DashboardLayout>
	)
}
