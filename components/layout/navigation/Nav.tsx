import ThemeSwitcher from "@/components/theme/background/switcher"
import Logo from "@/components/theme/logo"
import { UserProfile } from "@/features/authentication/types"
import { NavigationMenu } from "./navigation"
import UserMenu from "./user-menu"

type Props = {
  user: UserProfile
}

export default function Header({ user }: Props) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[20px] mt-4 bg-[rgba(23,24,37,0.25)] backdrop-blur-[20px]
                       shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),0_2px_8px_rgba(0,0,0,0.3)]
                       pointer-events-auto">
          <div className="flex justify-between h-16 px-4">
            <div className="flex items-center">
              <Logo fill="white" size="md" />
              <NavigationMenu />
            </div>
            <div className="flex items-center gap-4">
              <ThemeSwitcher />
              <UserMenu user={user} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
} 