import subprocess
import tkinter as tk
from tkinter import messagebox

# Global variable to keep track of the SSH process
ssh_process = None

def start_ssh_tunnel():
    global ssh_process
    try:
        if ssh_process is not None:
            messagebox.showwarning("SSH Tunnel", "SSH Tunnel is already running!")
            return
        
        ssh_process = subprocess.Popen(["ssh", "-D", "1337", "-i", "usa-key-pair.pem", 
                                        "ubuntu@ec2-13-57-200-207.us-west-1.compute.amazonaws.com", "sleep", "400"],
                                       stdout=subprocess.PIPE,
                                       stderr=subprocess.PIPE)
        messagebox.showinfo("SSH Tunnel", "SSH Tunnel started successfully!")
    except Exception as e:
        messagebox.showerror("Error", f"Failed to start SSH Tunnel: {e}")

def stop_ssh_tunnel():
    global ssh_process
    if ssh_process is None:
        messagebox.showinfo("SSH Tunnel", "SSH Tunnel is not running.")
    else:
        ssh_process.terminate()
        ssh_process = None
        messagebox.showinfo("SSH Tunnel", "SSH Tunnel stopped successfully.")

def main():
    root = tk.Tk()
    root.title("SSH Tunnel Starter")

    frame = tk.Frame(root)
    frame.pack(pady=20)

    start_button = tk.Button(frame, text="Start SSH Tunnel", command=start_ssh_tunnel)
    start_button.pack(side=tk.LEFT, padx=10)

    stop_button = tk.Button(frame, text="Stop SSH Tunnel", command=stop_ssh_tunnel)
    stop_button.pack(side=tk.RIGHT, padx=10)

    root.mainloop()

if __name__ == "__main__":
    main()
