import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export class Transition {
  private state: boolean;
  private showValue: string;
  private hiddenValue: string;
  private duration: string;
  private animationClass: string;

  constructor(
    state: boolean,
    showValue?: string,
    hiddenValue?: string,
    duration?: string
  ) {
    this.state = state;
    this.showValue = showValue || "";
    this.hiddenValue = hiddenValue || "";
    this.duration = duration || "";
    this.animationClass = "";
  }

  getClass(): Transition {
    this.showValue = this.showValue || "translate-y-0 ";
    this.hiddenValue = this.hiddenValue || "translate-y-12  ";
    this.duration = this.duration || "duration-700";
    this.animationClass = `${
      this.state
        ? `${this.showValue} opacity-100`
        : `${this.hiddenValue} pointer-events-none `
    } transition-all z-9999999 ${this.duration}`;
    return this;
  }

  toString(): string {
    return this.animationClass;
  }
}
