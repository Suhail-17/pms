import re

file_path = 'Campus.html'

with open(file_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Pattern for <section class='ComponentName_...'> or <div class='ComponentName_...'>
# We look for a capital letter to start the component name
pattern = re.compile(r'(\s*)(<(?:section|div|header|footer|nav)[^>]*class=[\'"](?:[^\'"]*\s)*([A-Z][a-zA-Z0-9]+)_[^\'"]*[\'"][^>]*>)')

def replacer(match):
    whitespace = match.group(1)
    tag = match.group(2)
    comp_name = match.group(3)
    
    # Avoid duplicate comments
    comment_str = f'<!-- ====== {comp_name} ====== -->'
    if comment_str in whitespace:
        return match.group(0)
        
    return f'{whitespace}{comment_str}\n{whitespace}{tag}'

new_html = pattern.sub(replacer, html)

# Identify sections with id but no component class
id_pattern = re.compile(r'(\s*)(<section[^>]*id=[\'"]([^\'"]+)[\'"](?![^>]*class=[\'"][^\'"]*[A-Z][a-zA-Z0-9]+_[^\'"]*[\'"])[^>]*>)')

def id_replacer(match):
    whitespace = match.group(1)
    tag = match.group(2)
    id_name = match.group(3).strip()
    if not id_name:
        return match.group(0)
    
    comment_str = f'<!-- ====== Section: {id_name} ====== -->'
    if comment_str in whitespace:
        return match.group(0)
        
    return f'{whitespace}{comment_str}\n{whitespace}{tag}'

new_html = id_pattern.sub(id_replacer, new_html)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_html)

print("Formatting successful!")
