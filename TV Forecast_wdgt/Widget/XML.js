// Find the child of an element that has the specified tag name
function findChild(element, tag_name)
{
	var child;
	
	for (child = element.firstChild; child != null; child = child.nextSibling)
	{
		if (child.tagName == tag_name)
		{
			return child;
		}
	}
	
	return null;
}

// Returns the data contained in the first child of an element
function firstChildData(element)
{
    if (element == null)
    {
        return null;
    }
    
    var firstChild = element.firstChild;
    
    if (firstChild)
    {
        return firstChild.data;
    }
    
    return null;
}