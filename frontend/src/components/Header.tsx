"use client"

import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Bell, Settings, LogOut} from "lucide-react"
import { useSelector } from 'react-redux';
import { RootState } from '../store'; // Adjust the import path as necessary

export function Header() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setIsUserLoggedIn(true);
    } else {
      setIsUserLoggedIn(false);
    }
  }, [user]);

  return (
    <header className="sticky top-0 w-full border-b bg-white z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <svg
                className="h-8 w-8 text-blue-600"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 5.17A10 10 0 0 1 20.85 9" />
                <path d="M15.17 2a10 10 0 0 1 2.83 2.83" />
                <path d="M12 12v.01" />
                <path d="M12 18.85A10 10 0 0 1 3.15 15" />
                <path d="M8.83 22a10 10 0 0 1-2.83-2.83" />
              </svg>
              <span className="ml-2 text-xl font-semibold text-gray-900">CoolSaaS</span>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-4">
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <Link to="/projects" className="text-gray-600 hover:text-gray-900">
              Projects
            </Link>
            <Link to="/team" className="text-gray-600 hover:text-gray-900">
              Team
            </Link>
            <Link to="/reports" className="text-gray-600 hover:text-gray-900">
              Reports
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            {isUserLoggedIn ? (
              <>
                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder-avatar.jpg" alt="@account" />
                        <AvatarFallback>RK</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">John Doe</p>
                        <p className="text-xs leading-none text-muted-foreground">john@example.com</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                     <Link to="/settings" className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/logout" className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link to="/login" className="text-gray-600 hover:text-gray-900">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

