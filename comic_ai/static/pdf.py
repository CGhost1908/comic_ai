from pdf2image import convert_from_path
from img2pdf import convert
import os
import pdfkit


def exportPdf(html_page, save_name):
    pdfkit.from_url(html_page, save_name)


exportPdf('google.com', 'a.pdf')

