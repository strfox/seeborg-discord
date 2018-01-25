import time


class Timer:

    def __init__(self):
        self.__start = None

    def start(self):
        self.__start = time.time()

    def stop(self):
        time_elapsed = time.time() - self.__start
        self.__start = None
        return time_elapsed
